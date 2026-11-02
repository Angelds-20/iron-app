// Motor de persistencia blindada para IRON (cero pérdida de datos)

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'iron_active_session_v2',
  LAST_WEIGHTS: 'iron_last_weights_v2',
  WORKOUT_HISTORY: 'iron_workouts_history_v2',
  PERSONAL_RECORDS: 'iron_personal_records_v2',
  COMPLETED_DATES: 'iron_completed_dates_v2',
  UNLOCKED_BADGES: 'iron_unlocked_badges_v2',
  TOTAL_XP: 'iron_total_xp_v2'
}

export function getActiveSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function saveActiveSession(sessionData) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(sessionData))
  } catch (e) {
    console.error('Error saving active session:', e)
  }
}

export function clearActiveSession() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION)
  } catch (e) {}
}

export function getLastUsedWeights() {
  if (typeof window === 'undefined') return { 'bench-press': 60 }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_WEIGHTS)
    const weights = raw ? JSON.parse(raw) : {}
    // Garantizar que banca tenga 60 kg registrado
    if (!weights['bench-press'] || weights['bench-press'] < 60) {
      weights['bench-press'] = 60
    }
    return weights
  } catch (e) {
    return { 'bench-press': 60 }
  }
}

export function saveLastUsedWeight(exerciseId, weight) {
  if (typeof window === 'undefined') return
  try {
    const current = getLastUsedWeights()
    current[exerciseId] = Number(weight)
    localStorage.setItem(STORAGE_KEYS.LAST_WEIGHTS, JSON.stringify(current))
  } catch (e) {}
}
