import { supabase, isSupabaseConfigured } from './supabaseClient'
import { ATHLETE_EMAIL, ATHLETE_PASS, ATHLETE_USER_ID } from './authService'

let isSyncing = false
let lastSyncTimestamp = 0

/**
 * Sincronización automática silenciosa y bidireccional con Supabase
 * Se ejecuta al abrir la app, al cambiar de visibilidad o al registrar comidas/entrenamientos.
 */
export async function triggerCloudAutoSync() {
  if (!isSupabaseConfigured || !supabase) return { success: false, reason: 'Offline' }
  if (isSyncing) return { success: false, reason: 'Already in progress' }

  // Evitar saturar si se ejecutó hace menos de 5 segundos
  if (Date.now() - lastSyncTimestamp < 5000) {
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
    const savedMacros = localStorage.getItem(`iron_macros_${todayStr}`)
    if (savedMacros) {
      try {
        const macrosData = JSON.parse(savedMacros)
        if (macrosData?.total_calories > 0 || macrosData?.logs?.length > 0) {
          // Guardar en custom_routines
          const { data: existing } = await supabase
            .from('custom_routines')
            .select('id')
            .eq('user_id', userId)
            .eq('title', `nutrition_${todayStr}`)
            .limit(1)

          if (existing && existing.length > 0) {
            await supabase.from('custom_routines').update({
              description: `Macros del ${todayStr} (${macrosData.total_calories} kcal, ${macrosData.total_protein}g P)`,
              exercises: macrosData
            }).eq('id', existing[0].id)
          } else {
            await supabase.from('custom_routines').insert({
              user_id: userId,
              title: `nutrition_${todayStr}`,
              category: 'daily_nutrition',
              description: `Macros del ${todayStr} (${macrosData.total_calories} kcal, ${macrosData.total_protein}g P)`,
              exercises: macrosData
            })
          }
        }
      } catch (e) {
        console.warn('Error syncing macros to cloud:', e)
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
