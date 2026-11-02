import { calculateEstimated1RM } from './overloadEngine'

/**
 * Mapeo de ejercicios a grupos musculares principales
 */
export const EXERCISE_MUSCLE_MAP = {
  'bench-press': 'Pecho',
  'incline-bench-press': 'Pecho',
  'pushups': 'Pecho',
  'bench-dips': 'Pecho',
  'barbell-row': 'Espalda',
  'deadlift': 'Espalda',
  'romanian-deadlift': 'Espalda',
  'back-squat': 'Pierna',
  'front-squat': 'Pierna',
  'lunges': 'Pierna',
  'calf-raises': 'Pierna',
  'military-press': 'Hombros',
  'upright-row': 'Hombros',
  'biceps-curl': 'Brazos',
  'preacher-curl': 'Brazos',
  'hammer-curl': 'Brazos',
  'french-press': 'Brazos',
  'close-grip-bench': 'Brazos'
}

/**
 * Obtiene la lista de ejercicios únicos presentes en el historial
 */
export function getExerciseListFromHistory(workoutsHistory = []) {
  const map = new Map()

  workoutsHistory.forEach((session) => {
    session.exercises?.forEach((ex) => {
      if (!map.has(ex.id)) {
        map.set(ex.id, {
          id: ex.id,
          name: ex.name,
          category: EXERCISE_MUSCLE_MAP[ex.id] || 'General'
        })
      }
    })
  })

  // Siempre garantizar los ejercicios emblemáticos de patio
  if (!map.has('bench-press')) {
    map.set('bench-press', { id: 'bench-press', name: 'Press de banca plano', category: 'Pecho' })
  }
  if (!map.has('deadlift')) {
    map.set('deadlift', { id: 'deadlift', name: 'Peso muerto', category: 'Espalda' })
  }
  if (!map.has('back-squat')) {
    map.set('back-squat', { id: 'back-squat', name: 'Sentadilla', category: 'Pierna' })
  }
  if (!map.has('barbell-row')) {
    map.set('barbell-row', { id: 'barbell-row', name: 'Remo con barra', category: 'Espalda' })
  }

  return Array.from(map.values())
}

/**
 * Extrae la progresión cronológica de un ejercicio para graficar curva de carga y 1RM
 */
export function getExerciseProgression(exerciseId, workoutsHistory = []) {
  const points = []

  // Ordenar historial de más antiguo a más reciente
  const sorted = [...workoutsHistory].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  )

  sorted.forEach((session) => {
    const ex = session.exercises?.find((e) => e.id === exerciseId)
    if (ex && ex.sets && ex.sets.length > 0) {
      const completedSets = ex.sets.filter((s) => s.completed !== false)
      if (completedSets.length > 0) {
        const weights = completedSets.map((s) => Number(s.weight) || 0)
        const maxWeight = Math.max(...weights)

        let best1RM = 0
        let bestSet = completedSets[0]

        completedSets.forEach((s) => {
          const e1rm = calculateEstimated1RM(s.weight, s.reps)
          if (e1rm > best1RM) {
            best1RM = e1rm
            bestSet = s
          }
        })

        const volume = completedSets.reduce(
          (acc, s) => acc + (Number(s.weight) || 0) * (Number(s.reps) || 0),
          0
        )

        const dateObj = new Date(session.completedAt)
        const formattedDate = dateObj.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short'
        })

        points.push({
          date: formattedDate,
          fullDate: session.completedAt,
          maxWeight,
          best1RM: Math.round(best1RM * 10) / 10,
          totalVolume: volume,
          setsCount: completedSets.length,
          bestSet: {
            weight: Number(bestSet.weight) || 0,
            reps: Number(bestSet.reps) || 0,
            rir: bestSet.rir !== undefined ? bestSet.rir : 2
          }
        })
      }
    }
  })

  // Métricas acumuladas del ejercicio
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]

  const maxWeightAllTime = points.length > 0 ? Math.max(...points.map((p) => p.maxWeight)) : 0
  const max1RMAllTime = points.length > 0 ? Math.max(...points.map((p) => p.best1RM)) : 0
  const totalVolumeAllTime = points.reduce((acc, p) => acc + p.totalVolume, 0)

  const weightProgress =
    firstPoint && lastPoint ? Math.round((lastPoint.maxWeight - firstPoint.maxWeight) * 10) / 10 : 0
  const percentProgress =
    firstPoint && firstPoint.maxWeight > 0
      ? Math.round(((lastPoint.maxWeight - firstPoint.maxWeight) / firstPoint.maxWeight) * 100)
      : 0

  return {
    points,
    maxWeightAllTime,
    max1RMAllTime,
    totalVolumeAllTime,
    weightProgress,
    percentProgress,
    sessionsCount: points.length,
    latestPoint: lastPoint || null
  }
}

/**
 * Calcula el volumen semanal acumulado (últimas 4 semanas)
 */
export function getWeeklyVolumeData(workoutsHistory = []) {
  const weeksMap = new Map()

  // Definir las últimas 4 semanas
  const now = new Date()
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const weekLabel = `Sem ${4 - i}`
    weeksMap.set(weekLabel, {
      label: weekLabel,
      volume: 0,
      sessionsCount: 0,
      dates: []
    })
  }

  // Acumular volumen por semana relativa
  workoutsHistory.forEach((session) => {
    const sessionDate = new Date(session.completedAt)
    const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

    let weekKey = null
    if (diffDays <= 7) weekKey = 'Sem 4'
    else if (diffDays <= 14) weekKey = 'Sem 3'
    else if (diffDays <= 21) weekKey = 'Sem 2'
    else if (diffDays <= 28) weekKey = 'Sem 1'

    if (weekKey && weeksMap.has(weekKey)) {
      const curr = weeksMap.get(weekKey)
      curr.volume += Number(session.totalVolume) || 0
      curr.sessionsCount += 1
      curr.dates.push(session.completedAt)
    }
  })

  const weeks = Array.from(weeksMap.values())
  const currentWeekVolume = weeks[weeks.length - 1]?.volume || 0
  const prevWeekVolume = weeks[weeks.length - 2]?.volume || 0
  const weekDiff = currentWeekVolume - prevWeekVolume
  const weekPercent =
    prevWeekVolume > 0 ? Math.round((weekDiff / prevWeekVolume) * 100) : 0

  return {
    weeks,
    currentWeekVolume,
    prevWeekVolume,
    weekDiff,
    weekPercent,
    averageWeeklyVolume: Math.round(
      weeks.reduce((acc, w) => acc + w.volume, 0) / Math.max(1, weeks.length)
    )
  }
}

/**
 * Calcula la frecuencia y distribución de estímulos por grupo muscular
 */
export function getMuscleDistribution(workoutsHistory = []) {
  const distribution = {
    Pecho: 0,
    Espalda: 0,
    Pierna: 0,
    Hombros: 0,
    Brazos: 0
  }

  let totalSets = 0

  workoutsHistory.forEach((session) => {
    session.exercises?.forEach((ex) => {
      const muscle = EXERCISE_MUSCLE_MAP[ex.id] || 'Pecho'
      const setsCount = ex.sets?.filter((s) => s.completed !== false).length || ex.sets?.length || 3
      if (distribution[muscle] !== undefined) {
        distribution[muscle] += setsCount
        totalSets += setsCount
      }
    })
  })

  // Asegurar proporción base coherente
  if (totalSets === 0) {
    distribution.Pecho = 8
    distribution.Espalda = 4
    distribution.Brazos = 6
    distribution.Pierna = 4
    totalSets = 22
  }

  const items = Object.entries(distribution).map(([name, sets]) => ({
    name,
    sets,
    percentage: Math.round((sets / totalSets) * 100) || 0
  })).sort((a, b) => b.sets - a.sets)

  return {
    items,
    totalSets
  }
}

/**
 * Compara directamente la última sesión con la penúltima
 */
export function compareLastTwoSessions(workoutsHistory = []) {
  if (!workoutsHistory || workoutsHistory.length === 0) return null

  const current = workoutsHistory[0]
  const previous = workoutsHistory[1] || null

  if (!previous) {
    return {
      hasComparison: false,
      current,
      summary: 'Primera sesión registrada. Tu línea de base para sobrecarga progresiva.'
    }
  }

  const volumeDiff = (current.totalVolume || 0) - (previous.totalVolume || 0)
  const weightDiff = (current.maxWeight || 0) - (previous.maxWeight || 0)
  const setsDiff = (current.completedSetsCount || 0) - (previous.completedSetsCount || 0)

  return {
    hasComparison: true,
    current,
    previous,
    volumeDiff,
    weightDiff,
    setsDiff,
    isOverloadAchieved: volumeDiff > 0 || weightDiff > 0
  }
}

/**
 * Récords Personales Auditados (PRs reales de levantador de patio)
 */
export function getAuditedPersonalRecords(workoutsHistory = [], basePRs = {}) {
  const prs = {
    benchPress: Math.max(60, Number(basePRs.benchPress) || 60),
    inclineBench: Math.max(60, Number(basePRs.inclineBench) || 60),
    deadlift: Math.max(60, Number(basePRs.deadlift) || 60),
    squat: Math.max(60, Number(basePRs.squat) || 60),
    barbellRow: Math.max(60, Number(basePRs.barbellRow) || 60),
    frenchPress: Math.max(14, Number(basePRs.frenchPress) || 14),
    bicepsCurl: Math.max(14, Number(basePRs.bicepsCurl) || 14),
    lunges: Math.max(14, Number(basePRs.lunges) || 14),
    calfRaises: Math.max(60, Number(basePRs.calfRaises) || 60)
  }

  // Recorrer el historial para verificar si se batió alguna marca
  workoutsHistory.forEach((session) => {
    session.exercises?.forEach((ex) => {
      const maxInSession = Math.max(...(ex.sets?.map((s) => Number(s.weight) || 0) || [0]))
      if (ex.id === 'bench-press' && maxInSession > prs.benchPress) prs.benchPress = maxInSession
      if (ex.id === 'incline-bench-press' && maxInSession > prs.inclineBench) prs.inclineBench = maxInSession
      if (ex.id === 'deadlift' && maxInSession > prs.deadlift) prs.deadlift = maxInSession
      if (ex.id === 'back-squat' && maxInSession > prs.squat) prs.squat = maxInSession
      if (ex.id === 'barbell-row' && maxInSession > prs.barbellRow) prs.barbellRow = maxInSession
      if (ex.id === 'french-press' && maxInSession > prs.frenchPress) prs.frenchPress = maxInSession
      if (ex.id === 'biceps-curl' && maxInSession > prs.bicepsCurl) prs.bicepsCurl = maxInSession
      if (ex.id === 'lunges' && maxInSession > prs.lunges) prs.lunges = maxInSession
      if (ex.id === 'calf-raises' && maxInSession > prs.calfRaises) prs.calfRaises = maxInSession
    })
  })

  return [
    {
      id: 'bench-press',
      name: 'Press de Banca Plano',
      weight: prs.benchPress,
      unit: 'kg',
      targetWeight: 70,
      equipment: 'Barra (60 kg) + Banco',
      estimated1RM: calculateEstimated1RM(prs.benchPress, 10),
      status: 'Ayer: 3 × 10 @ 60kg'
    },
    {
      id: 'incline-bench-press',
      name: 'Press Inclinado',
      weight: prs.inclineBench,
      unit: 'kg',
      targetWeight: 70,
      equipment: 'Barra (60 kg) + Banco',
      estimated1RM: calculateEstimated1RM(prs.inclineBench, 10),
      status: 'Ayer: 2 × 10, 1 × 6 @ 60kg'
    },
    {
      id: 'barbell-row',
      name: 'Remo al Pecho con Barra',
      weight: prs.barbellRow,
      unit: 'kg',
      targetWeight: 70,
      equipment: 'Barra principal (60 kg)',
      estimated1RM: calculateEstimated1RM(prs.barbellRow, 10),
      status: 'Ayer: 3 × 10 @ 60kg'
    },
    {
      id: 'back-squat',
      name: 'Sentadilla con Barra',
      weight: prs.squat,
      unit: 'kg',
      targetWeight: 70,
      equipment: 'Barra sacada de soportes',
      estimated1RM: calculateEstimated1RM(prs.squat, 10),
      status: '4 × 10 @ 60kg • RIR 2'
    },
    {
      id: 'deadlift',
      name: 'Peso Muerto',
      weight: prs.deadlift,
      unit: 'kg',
      targetWeight: 80,
      equipment: 'Barra (60 kg) desde el suelo',
      estimated1RM: calculateEstimated1RM(prs.deadlift, 8),
      status: '4 × 8 @ 60kg'
    },
    {
      id: 'french-press',
      name: 'Press Francés',
      weight: prs.frenchPress,
      unit: 'kg',
      targetWeight: 18,
      equipment: 'Barra chica (14 kg)',
      estimated1RM: calculateEstimated1RM(prs.frenchPress, 15),
      status: 'Ayer: 3 × 15 @ 14kg'
    },
    {
      id: 'biceps-curl',
      name: 'Curl de Bíceps',
      weight: prs.bicepsCurl,
      unit: 'kg',
      targetWeight: 18,
      equipment: 'Barra chica (14 kg)',
      estimated1RM: calculateEstimated1RM(prs.bicepsCurl, 15),
      status: 'Ayer: 3 × 15 @ 14kg'
    },
    {
      id: 'calf-raises',
      name: 'Elevación de Gemelos',
      weight: prs.calfRaises,
      unit: 'kg',
      targetWeight: 70,
      equipment: 'Barra principal (60 kg)',
      estimated1RM: calculateEstimated1RM(prs.calfRaises, 15),
      status: '3 × 15 @ 60kg'
    }
  ]
}

/**
 * Semilla realista del historial con la sesión ejecutada ayer por Angel:
 * - 60 kg en banca (3 x 10)
 * - 60 kg en inclinado (2 x 10 + 1 x 6)
 * - 60 kg en remo al pecho (3 x 10)
 * - 14 kg en press francés (3 x 15)
 * - 14 kg en curl (3 x 15)
 * - 1:30 min de descanso entre series
 * - Total: 6.420 kg de volumen
 */
export function getRealisticProgressionSeed() {
  const now = new Date()
  const dYesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
  const dMinus4 = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
  const dMinus8 = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
  const dMinus12 = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)

  return [
    {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 48,
      completedAt: dYesterday.toISOString(),
      totalVolume: 6420,
      maxWeight: 60,
      completedSetsCount: 15,
      restSeconds: 90,
      watchMetrics: { avgBpm: 138, maxBpm: 168, caloriesBurned: 380 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'incline-bench-press',
          name: 'Press inclinado',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, rir: 1, completed: true },
            { setNumber: 2, weight: 60, reps: 10, rir: 1, completed: true },
            { setNumber: 3, weight: 60, reps: 6, rir: 0, completed: true }
          ]
        },
        {
          id: 'barbell-row',
          name: 'Remo con barra (Remo al pecho)',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'french-press',
          name: 'Press francés',
          sets: [
            { setNumber: 1, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 15, rir: 2, completed: true }
          ]
        },
        {
          id: 'biceps-curl',
          name: 'Curl de bíceps',
          sets: [
            { setNumber: 1, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 15, rir: 2, completed: true }
          ]
        }
      ]
    },
    {
      routineId: 'pierna-fuerza',
      title: 'Pierna — Sentadilla & Peso Muerto',
      category: 'pierna',
      durationMinutes: 44,
      completedAt: dMinus4.toISOString(),
      totalVolume: 7440,
      maxWeight: 60,
      completedSetsCount: 14,
      restSeconds: 90,
      watchMetrics: { avgBpm: 144, maxBpm: 174, caloriesBurned: 410 },
      exercises: [
        {
          id: 'back-squat',
          name: 'Sentadilla con barra',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 4, weight: 60, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'deadlift',
          name: 'Peso muerto con barra',
          sets: [
            { setNumber: 1, weight: 60, reps: 8, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 8, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 8, rir: 2, completed: true },
            { setNumber: 4, weight: 60, reps: 8, rir: 2, completed: true }
          ]
        },
        {
          id: 'lunges',
          name: 'Zancadas con barra chica',
          sets: [
            { setNumber: 1, weight: 14, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'calf-raises',
          name: 'Elevación de gemelos',
          sets: [
            { setNumber: 1, weight: 60, reps: 15, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 15, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 15, rir: 2, completed: true }
          ]
        }
      ]
    },
    {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 45,
      completedAt: dMinus8.toISOString(),
      totalVolume: 5600,
      maxWeight: 57.5,
      completedSetsCount: 15,
      restSeconds: 90,
      watchMetrics: { avgBpm: 135, maxBpm: 165, caloriesBurned: 350 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 57.5, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 57.5, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 57.5, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'incline-bench-press',
          name: 'Press inclinado',
          sets: [
            { setNumber: 1, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 50, reps: 8, rir: 1, completed: true }
          ]
        },
        {
          id: 'barbell-row',
          name: 'Remo con barra (Remo al pecho)',
          sets: [
            { setNumber: 1, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 50, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'french-press',
          name: 'Press francés',
          sets: [
            { setNumber: 1, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 15, rir: 2, completed: true }
          ]
        },
        {
          id: 'biceps-curl',
          name: 'Curl de bíceps',
          sets: [
            { setNumber: 1, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 15, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 15, rir: 2, completed: true }
          ]
        }
      ]
    },
    {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 44,
      completedAt: dMinus12.toISOString(),
      totalVolume: 5100,
      maxWeight: 55,
      completedSetsCount: 15,
      restSeconds: 90,
      watchMetrics: { avgBpm: 132, maxBpm: 160, caloriesBurned: 330 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 55, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 55, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 55, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'incline-bench-press',
          name: 'Press inclinado',
          sets: [
            { setNumber: 1, weight: 45, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 45, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 45, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'barbell-row',
          name: 'Remo con barra (Remo al pecho)',
          sets: [
            { setNumber: 1, weight: 45, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 45, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 45, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'french-press',
          name: 'Press francés',
          sets: [
            { setNumber: 1, weight: 14, reps: 12, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 12, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 12, rir: 2, completed: true }
          ]
        },
        {
          id: 'biceps-curl',
          name: 'Curl de bíceps',
          sets: [
            { setNumber: 1, weight: 14, reps: 12, rir: 2, completed: true },
            { setNumber: 2, weight: 14, reps: 12, rir: 2, completed: true },
            { setNumber: 3, weight: 14, reps: 12, rir: 2, completed: true }
          ]
        }
      ]
    }
  ]
}
