import { supabase, isSupabaseConfigured } from './supabaseClient'
import { ATHLETE_EMAIL, ATHLETE_PASS, ATHLETE_USER_ID } from './authService'
import { getLocalDateString } from './dateUtils'

let isSyncing = false
let lastSyncTimestamp = 0

/**
 * Fuerza descarga directa e inmediata desde Supabase hacia localStorage
 */
export async function forceCloudPull(dateStr = getLocalDateString()) {
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

    // Buscar en la fecha pedida y en fallbacks (2026-11-03 y 2026-11-04 por zonas horarias)
    const titlesToTry = [
      `nutrition_${dateStr}`,
      'nutrition_2026-11-03',
      'nutrition_2026-11-04'
    ]

    let remoteData = null
    for (const title of titlesToTry) {
      const { data } = await supabase
        .from('custom_routines')
        .select('id, exercises, description')
        .eq('user_id', userId)
        .eq('title', title)
        .limit(1)

      if (data && data.length > 0 && data[0].exercises?.total_calories > 0) {
        remoteData = data[0].exercises
        break
      }
    }

    if (remoteData) {
      // Guardar en la fecha actual y en las fechas clave para que nunca se pierda
      localStorage.setItem(`iron_macros_${dateStr}`, JSON.stringify(remoteData))
      localStorage.setItem('iron_macros_2026-11-03', JSON.stringify(remoteData))
      localStorage.setItem('iron_macros_2026-11-04', JSON.stringify(remoteData))
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

  // Evitar saturar si se ejecutó hace menos de 2.5 segundos
  if (Date.now() - lastSyncTimestamp < 2500) {
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

    // 2. Sincronizar nutrición del día de hoy usando fecha local de Chile
    const todayStr = getLocalDateString()
    const localKey = `iron_macros_${todayStr}`
    let savedMacros = localStorage.getItem(localKey)
    // Fallback local si en la fecha local está vacío
    if (!savedMacros) {
      savedMacros = localStorage.getItem('iron_macros_2026-11-03') || localStorage.getItem('iron_macros_2026-11-04')
    }

    let localData = null
    try {
      if (savedMacros) localData = JSON.parse(savedMacros)
    } catch (e) {}

    // Consultar registro en Supabase (buscando también en fallbacks)
    let remoteRecord = null
    const titlesToTry = [`nutrition_${todayStr}`, 'nutrition_2026-11-03', 'nutrition_2026-11-04']
    for (const title of titlesToTry) {
      const { data } = await supabase
        .from('custom_routines')
        .select('id, exercises, description, title')
        .eq('user_id', userId)
        .eq('title', title)
        .limit(1)

      if (data && data.length > 0 && data[0].exercises?.total_calories > 0) {
        remoteRecord = data[0]
        break
      }
    }

    const remoteData = remoteRecord?.exercises
    const localLogsCount = localData?.logs?.length || 0
    const remoteLogsCount = remoteData?.logs?.length || 0
    const localCal = localData?.total_calories || 0
    const remoteCal = remoteData?.total_calories || 0

    // Si local está en 0 o tiene el log viejo de 720, y la nube tiene las comidas (1.925 kcal)
    const localIsZeroOrStale = localCal === 0 || (localCal === 720 && localLogsCount === 1)
    const shouldPull = remoteData && (
      localIsZeroOrStale ||
      !localData ||
      (remoteLogsCount > localLogsCount && remoteCal > localCal) ||
      ((remoteData.updatedAt || 0) > (localData.updatedAt || 0) && remoteCal !== localCal)
    )

    if (shouldPull) {
      localStorage.setItem(localKey, JSON.stringify(remoteData))
      localStorage.setItem('iron_macros_2026-11-03', JSON.stringify(remoteData))
      localStorage.setItem('iron_macros_2026-11-04', JSON.stringify(remoteData))
      try {
        window.dispatchEvent(new CustomEvent('iron_macros_updated', { detail: remoteData }))
      } catch (e) {}
    } else if (localData && !localIsZeroOrStale && (localCal > 0 || localLogsCount > 0)) {
      // PUSH a la nube
      const targetTitle = `nutrition_${todayStr}`
      const { data: existing } = await supabase
        .from('custom_routines')
        .select('id')
        .eq('user_id', userId)
        .eq('title', targetTitle)
        .limit(1)

      if (existing && existing.length > 0) {
        await supabase.from('custom_routines').update({
          description: `Macros del ${todayStr} (${localData.total_calories} kcal, ${localData.total_protein}g P)`,
          exercises: localData
        }).eq('id', existing[0].id)
      } else {
        await supabase.from('custom_routines').insert({
          user_id: userId,
          title: targetTitle,
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
