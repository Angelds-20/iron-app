import { supabase, isSupabaseConfigured } from './supabaseClient'

/**
 * Servicio de sincronización silenciosa con Supabase
 */
export async function syncWorkoutToCloud(workoutData, userProfile = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, reason: 'Supabase no configurado' }
  }

  try {
    // 1. Obtener sesión de usuario o crear sesión anónima/persistente
    let { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // Intentar iniciar sesión anónima si está habilitada en el proyecto
      const { data: anonAuth, error: anonErr } = await supabase.auth.signInAnonymously()
      if (!anonErr && anonAuth?.session) {
        session = anonAuth.session
      }
    }

    const userId = session?.user?.id

    if (!userId) {
      // Si RLS requiere auth y no hay sesión activa, los datos siguen 100% seguros en localStorage
      return { success: true, localOnly: true }
    }

    // 2. Insertar en tabla workouts
    const { data: workoutRecord, error: workoutErr } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        title: workoutData.title,
        category: workoutData.category || 'torso',
        duration_minutes: workoutData.durationMinutes || 45,
        avg_bpm: workoutData.watchMetrics?.avgBpm || null,
        calories_burned: workoutData.watchMetrics?.caloriesBurned || null,
        completed_at: workoutData.completedAt || new Date().toISOString()
      })
      .select('id')
      .single()

    if (workoutErr) {
      console.warn('Error syncing workout to Supabase:', workoutErr.message)
      return { success: false, error: workoutErr }
    }

    const workoutId = workoutRecord.id

    // 3. Insertar ejercicios y series
    for (const ex of (workoutData.exercises || [])) {
      const { data: exRecord } = await supabase
        .from('exercises')
        .insert({
          workout_id: workoutId,
          name: ex.name,
          order_index: 0
        })
        .select('id')
        .single()

      if (exRecord?.id && ex.sets?.length > 0) {
        const setRows = ex.sets
          .filter(s => s.completed)
          .map((s, idx) => ({
            exercise_id: exRecord.id,
            set_number: s.setNumber || idx + 1,
            weight_kg: Number(s.weight) || 0,
            reps: Number(s.reps) || 0,
            rir: Number(s.rir) || 2
          }))

        if (setRows.length > 0) {
          await supabase.from('exercise_sets').insert(setRows)
        }
      }
    }

    return { success: true, workoutId }
  } catch (err) {
    console.error('Excepción al sincronizar en Supabase:', err)
    return { success: false, error: err }
  }
}
