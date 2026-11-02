import { BADGES_CATALOG } from './constants'

/**
 * Calcula el 1RM estimado usando la fórmula de Epley: Peso * (1 + Reps / 30)
 */
export function calculateEstimated1RM(weight, reps) {
  const w = Number(weight) || 0
  const r = Number(reps) || 0
  if (w <= 0 || r <= 0) return 0
  if (r === 1) return w
  return Math.round(w * (1 + r / 30) * 10) / 10
}

/**
 * Compara en caliente el desempeño de la sesión actual contra la anterior
 */
export function compareWithPreviousSession(currentSets = [], lastPerformance = null) {
  if (!lastPerformance || !lastPerformance.sets || lastPerformance.sets.length === 0) {
    return null
  }

  const lastSets = lastPerformance.sets
  const currentCompleted = currentSets.filter((s) => s.completed)

  const lastMaxWeight = Math.max(...lastSets.map((s) => Number(s.weight) || 0))
  const lastTotalVolume = lastSets.reduce(
    (acc, s) => acc + (Number(s.weight) || 0) * (Number(s.reps) || 0),
    0
  )

  const currMaxWeight = currentCompleted.length > 0
    ? Math.max(...currentCompleted.map((s) => Number(s.weight) || 0))
    : Math.max(...currentSets.map((s) => Number(s.weight) || 0))

  const currTotalVolume = currentCompleted.reduce(
    (acc, s) => acc + (Number(s.weight) || 0) * (Number(s.reps) || 0),
    0
  )

  const weightDiff = currMaxWeight - lastMaxWeight
  const volumeDiff = currTotalVolume - lastTotalVolume

  // Progresando si subió el peso o si completó más volumen efectivo
  const isProgressing = weightDiff > 0 || (weightDiff === 0 && volumeDiff > 0)

  return {
    isProgressing,
    weightDiff,
    volumeDiff,
    lastMaxWeight,
    currMaxWeight,
    lastTotalVolume,
    currTotalVolume
  }
}

/**
 * Genera un resumen compacto de la última sesión
 * Ej: "50 kg • 3 × 10 reps (RIR 2)"
 */
export function formatPreviousSessionSummary(lastPerformance) {
  if (!lastPerformance || !lastPerformance.sets || lastPerformance.sets.length === 0) {
    return 'Sin registros previos (Sesión base)'
  }

  const sets = lastPerformance.sets
  const maxWeight = Math.max(...sets.map((s) => Number(s.weight) || 0))
  const setsCount = sets.length
  const avgReps = Math.round(sets.reduce((acc, s) => acc + (Number(s.reps) || 0), 0) / setsCount)
  const avgRir = sets.reduce((acc, s) => acc + (s.rir !== undefined ? Number(s.rir) : 2), 0) / setsCount

  return `${maxWeight} kg • ${setsCount} × ${avgReps} reps (RIR ${avgRir.toFixed(0)})`
}

/**
 * Calcula la recomendación de sobrecarga progresiva para el siguiente entrenamiento
 */
export function calculateOverload(lastPerformance) {
  if (!lastPerformance || !lastPerformance.sets || lastPerformance.sets.length === 0) {
    return {
      type: 'baseline',
      message: 'Sesión base. Establece tu punto de partida con buena técnica.',
      suggestedWeight: null,
      suggestedReps: null,
      focus: 'Técnica y control de tempo (3 seg bajada)'
    }
  }

  const sets = lastPerformance.sets
  const avgWeight = sets.reduce((acc, s) => acc + Number(s.weight), 0) / sets.length
  const maxWeight = Math.max(...sets.map(s => Number(s.weight)))
  const totalReps = sets.reduce((acc, s) => acc + Number(s.reps), 0)
  const avgReps = totalReps / sets.length
  const avgRir = sets.reduce((acc, s) => acc + (s.rir !== undefined ? Number(s.rir) : 2), 0) / sets.length

  // Caso 1: RIR cómodo (>= 2) y completó 10 o más reps promedio -> Subir carga
  if (avgRir >= 2 && avgReps >= 9.5) {
    const nextWeight = maxWeight + 2.5
    return {
      type: 'increase_weight',
      message: `¡Gran reserva de fuerza! La sesión pasada promediaste ${avgReps.toFixed(0)} reps con RIR ${avgRir.toFixed(1)}.`,
      suggestedWeight: nextWeight,
      targetReps: '8 - 10',
      actionBadge: `+2.5 kg (${nextWeight} kg)`,
      focus: 'Aumentar peso manteniendo RIR 2'
    }
  }

  // Caso 2: RIR adecuado pero reps en rango medio (8-9 reps) -> Subir repeticiones con el mismo peso
  if (avgReps < 9.5 && avgRir >= 1.5) {
    return {
      type: 'increase_reps',
      message: `Consolida los ${maxWeight} kg buscando 1 o 2 repeticiones extra antes de subir peso.`,
      suggestedWeight: maxWeight,
      targetReps: `${Math.min(12, Math.round(avgReps + 1))} reps`,
      actionBadge: '+1 rep por serie',
      focus: 'Sobrecarga por volumen y densidad'
    }
  }

  // Caso 3: RIR bajo (0 o 1) o fatiga alta -> Mantener peso y mejorar tempo
  return {
    type: 'consolidate',
    message: `Estuviste cerca del fallo la sesión anterior. Mantén ${maxWeight} kg y pule el tempo de 3 segundos excéntricos.`,
    suggestedWeight: maxWeight,
    targetReps: '8 - 10 reps',
    actionBadge: 'Tempo 3-0-1',
    focus: 'Mayor tiempo bajo tensión sin sobrecargar articulaciones'
  }
}

/**
 * Evalúa y otorga medallas / logros (Gamificación sin emojis)
 */
export function evaluateAchievements(currentBadges = [], workoutSummary, allWorkouts = []) {
  const existingCodes = new Set(currentBadges.map(b => b.code))
  const newlyUnlocked = []

  // 1. Primer entrenamiento
  if (!existingCodes.has('FIRST_SESSION') && allWorkouts.length >= 1) {
    const badge = BADGES_CATALOG.find(b => b.code === 'FIRST_SESSION')
    if (badge) newlyUnlocked.push(badge)
  }

  // 2. Racha de 3 y 7 días
  if (!existingCodes.has('STREAK_3') && allWorkouts.length >= 3) {
    const badge = BADGES_CATALOG.find(b => b.code === 'STREAK_3')
    if (badge) newlyUnlocked.push(badge)
  }
  if (!existingCodes.has('STREAK_7') && allWorkouts.length >= 7) {
    const badge = BADGES_CATALOG.find(b => b.code === 'STREAK_7')
    if (badge) newlyUnlocked.push(badge)
  }

  // 3. Club 50 kg
  if (!existingCodes.has('BENCH_50KG') && workoutSummary?.maxWeight >= 50) {
    const badge = BADGES_CATALOG.find(b => b.code === 'BENCH_50KG')
    if (badge) newlyUnlocked.push(badge)
  }

  // 4. Máxima carga 60 kg (toda la barra)
  if (!existingCodes.has('MAX_WEIGHT_60KG') && workoutSummary?.maxWeight >= 60) {
    const badge = BADGES_CATALOG.find(b => b.code === 'MAX_WEIGHT_60KG')
    if (badge) newlyUnlocked.push(badge)
  }

  // 5. Volumen > 2000 kg
  if (!existingCodes.has('VOLUME_2000KG') && workoutSummary?.totalVolume >= 2000) {
    const badge = BADGES_CATALOG.find(b => b.code === 'VOLUME_2000KG')
    if (badge) newlyUnlocked.push(badge)
  }

  return newlyUnlocked
}

/**
 * Calcula nivel y experiencia
 */
export function calculateLevel(xp = 0) {
  const level = Math.floor(xp / 250) + 1
  const currentLevelXp = xp % 250
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 250) * 100))
  
  const rankTitles = [
    'Iniciado',
    'Constante',
    'Guerrero de Patio',
    'Titán de Hierro',
    'Maestro de Barra',
    'Élite Progresiva'
  ]
  const title = rankTitles[Math.min(level - 1, rankTitles.length - 1)]

  return {
    level,
    title,
    currentLevelXp,
    xpToNext: 250 - currentLevelXp,
    progressPercent
  }
}
