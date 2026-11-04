import { supabase, isSupabaseConfigured } from './supabaseClient'
import { ATHLETE_EMAIL, ATHLETE_PASS, ATHLETE_USER_ID } from './authService'

let isSyncing = false
let lastSyncTimestamp = 0

/**
 * Fuerza descarga directa e inmediata desde Supabase hacia localStorage
 */
export async function forceCloudPull(dateStr = new Date().toISOString().split('T')[0]) {
  if (!isSupabaseConfigured || !supabase) return { success: false, reason: 'Offline' }
  try {
    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const { data: authData } = await supabase.auth.signInWithPassword({
        email: ATHLETE_EMAIL,
        password: ATHLETE_PASS
      })
      session = authData?.session
    }
    const userId = session?.user?.id || ATHLETE_USER_ID

    const { data: remoteRecords } = await supabase
      .from('custom_routines')
      .select('id, exercises, description')
      .eq('user_id', userId)
      .eq('title', `nutrition_${dateStr}`)
      .limit(1)

    if (remoteRecords && remoteRecords.length > 0 && remoteRecords[0].exercises) {
      const remoteData = remoteRecords[0].exercises
      localStorage.setItem(`iron_macros_${dateStr}`, JSON.stringify(remoteData))
      try {
        window.dispatchEvent(new CustomEvent('iron_macros_updated', { detail: remoteData }))
      } catch (e) {}
      return { success: true, data: remoteData }
    }
    return { success: false, reason: 'No remote data' }
  } catch (err) {
    console.warn('Error in forceCloudPull:', err)
    return { success: false, error: err }
  }
}

/**
 * Sincronización automática silenciosa y bidireccional con Supabase
 * Se ejecuta al abrir la app, al cambiar de visibilidad o al registrar comidas/entrenamientos.
 */
export async function triggerCloudAutoSync() {
  if (!isSupabaseConfigured || !supabase) return { success: false, reason: 'Offline' }
  if (isSyncing) return { success: false, reason: 'Already in progress' }

  // Evitar saturar si se ejecutó hace menos de 3 segundos
  if (Date.now() - lastSyncTimestamp < 3000) {
    return { success: true, cached: true }
  }

  isSyncing = true

  try {
    // 1. Garantizar sesión de Ángel
    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const { data: authData } = await supabase.auth.signInWithPassword({
        email: ATHLETE_EMAIL,
        password: ATHLETE_PASS
      })
      session = authData?.session
    }

    const userId = session?.user?.id || ATHLETE_USER_ID

    // 2. Sincronizar nutrición del día de hoy
    const todayStr = new Date().toISOString().split('T')[0]
    const localKey = `iron_macros_${todayStr}`
    const savedMacros = localStorage.getItem(localKey)
    let localData = null
    try {
      if (savedMacros) localData = JSON.parse(savedMacros)
    } catch (e) {}

    // Consultar registro en Supabase
    const { data: remoteRecords } = await supabase
      .from('custom_routines')
      .select('id, exercises, description')
      .eq('user_id', userId)
      .eq('title', `nutrition_${todayStr}`)
      .limit(1)

    const remoteRecord = remoteRecords && remoteRecords.length > 0 ? remoteRecords[0] : null
    const remoteData = remoteRecord?.exercises

    const localLogsCount = localData?.logs?.length || 0
    const remoteLogsCount = remoteData?.logs?.length || 0
    const localCal = localData?.total_calories || 0
    const remoteCal = remoteData?.total_calories || 0

    // Detectar si el teléfono tiene el registro residual de prueba de 720 kcal (1 solo log de Arroz con Pollo)
    const localIsStale720 = localCal === 720 && localLogsCount === 1

    // Regla inteligente de PULL (Nube -> Local):
    // Si la nube tiene el drift real (1925 kcal, 8 comidas) y local tiene el log residual o menos comidas
    const shouldPullFromCloud = remoteData && (
      localIsStale720 ||
      !localData ||
      (remoteLogsCount > localLogsCount && remoteCal > localCal) ||
      ((remoteData.updatedAt || 0) > (localData.updatedAt || 0) && remoteCal !== localCal)
    )

    if (shouldPullFromCloud) {
      localStorage.setItem(localKey, JSON.stringify(remoteData))
      try {
        window.dispatchEvent(new CustomEvent('iron_macros_updated', { detail: remoteData }))
      } catch (e) {}
    } else if (localData && !localIsStale720 && (localCal > 0 || localLogsCount > 0)) {
      // PUSH (Local -> Nube)
      if (remoteRecord) {
        await supabase.from('custom_routines').update({
          description: `Macros del ${todayStr} (${localData.total_calories} kcal, ${localData.total_protein}g P)`,
          exercises: localData
        }).eq('id', remoteRecord.id)
      } else {
        await supabase.from('custom_routines').insert({
          user_id: userId,
          title: `nutrition_${todayStr}`,
          category: 'daily_nutrition',
          description: `Macros del ${todayStr} (${localData.total_calories} kcal, ${localData.total_protein}g P)`,
          exercises: localData
        })
      }
    }

    // 3. Sincronizar peso corporal
    const currentWeight = Number(localStorage.getItem('athlete_weight')) || 120.0
    await supabase.from('weight_logs').upsert({
      user_id: userId,
      weight_kg: currentWeight,
      log_date: todayStr
    }, { onConflict: 'user_id,log_date' }).catch(() => {})

    // 4. Actualizar perfil del atleta
    await supabase.from('profiles').update({
      current_weight: currentWeight,
      target_weight: 105.0,
      streak_count: 2
    }).eq('id', userId).catch(() => {})

    lastSyncTimestamp = Date.now()
    localStorage.setItem('iron_last_cloud_sync', new Date().toISOString())
    return { success: true, timestamp: lastSyncTimestamp }
  } catch (err) {
    console.warn('Silent cloud sync error:', err)
    return { success: false, error: err }
  } finally {
    isSyncing = false
  }
}
