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
    deadlift: Math.max(60, Number(basePRs.deadlift) || 60),
    squat: Math.max(50, Number(basePRs.squat) || 50),
    barbellRow: Math.max(40, Number(basePRs.barbellRow) || 40),
    preacherCurl: Math.max(14, Number(basePRs.preacherCurl) || 14)
  }

  // Recorrer el historial para verificar si se batió alguna marca
  workoutsHistory.forEach((session) => {
    session.exercises?.forEach((ex) => {
      const maxInSession = Math.max(...(ex.sets?.map((s) => Number(s.weight) || 0) || [0]))
      if (ex.id === 'bench-press' && maxInSession > prs.benchPress) prs.benchPress = maxInSession
      if (ex.id === 'deadlift' && maxInSession > prs.deadlift) prs.deadlift = maxInSession
      if (ex.id === 'back-squat' && maxInSession > prs.squat) prs.squat = maxInSession
      if (ex.id === 'barbell-row' && maxInSession > prs.barbellRow) prs.barbellRow = maxInSession
      if (ex.id === 'preacher-curl' && maxInSession > prs.preacherCurl) prs.preacherCurl = maxInSession
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
      status: prs.benchPress >= 60 ? 'Carga Máxima de Barra' : 'Progresando'
    },
    {
      id: 'deadlift',
      name: 'Peso Muerto',
      weight: prs.deadlift,
      unit: 'kg',
      targetWeight: 100,
      equipment: 'Barra (60 kg) desde el suelo',
      estimated1RM: calculateEstimated1RM(prs.deadlift, 8),
      status: 'Dominio de 60 kg'
    },
    {
      id: 'back-squat',
      name: 'Sentadilla Trasera',
      weight: prs.squat,
      unit: 'kg',
      targetWeight: 60,
      equipment: 'Barra sacada de soportes',
      estimated1RM: calculateEstimated1RM(prs.squat, 10),
      status: 'RIR 2 estricto'
    },
    {
      id: 'barbell-row',
      name: 'Remo con Barra',
      weight: prs.barbellRow,
      unit: 'kg',
      targetWeight: 50,
      equipment: 'Barra principal',
      estimated1RM: calculateEstimated1RM(prs.barbellRow, 10),
      status: 'Control lumbar'
    },
    {
      id: 'preacher-curl',
      name: 'Curl Predicador',
      weight: prs.preacherCurl,
      unit: 'kg',
      targetWeight: 18,
      equipment: 'Barra chica (14 kg)',
      estimated1RM: calculateEstimated1RM(prs.preacherCurl, 10),
      status: 'Aislamiento en banco'
    }
  ]
}

/**
 * Semilla realista de sesiones anteriores si el historial es nuevo,
 * demostrando la sobrecarga progresiva desde 52.5 kg hasta los 60 kg actuales.
 */
export function getRealisticProgressionSeed() {
  const dToday = new Date()
  const dMinus3 = new Date(dToday.getTime() - 3 * 24 * 60 * 60 * 1000)
  const dMinus7 = new Date(dToday.getTime() - 7 * 24 * 60 * 60 * 1000)
  const dMinus11 = new Date(dToday.getTime() - 11 * 24 * 60 * 60 * 1000)

  return [
    {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 40,
      completedAt: dToday.toISOString(),
      totalVolume: 2400,
      maxWeight: 60,
      completedSetsCount: 4,
      watchMetrics: { avgBpm: 135, maxBpm: 165, caloriesBurned: 260 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 10, rir: 2, completed: true },
            { setNumber: 4, weight: 60, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'incline-bench-press',
          name: 'Press inclinado',
          sets: [
            { setNumber: 1, weight: 40, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 40, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 40, reps: 9, rir: 1, completed: true }
          ]
        },
        {
          id: 'barbell-row',
          name: 'Remo con barra',
          sets: [
            { setNumber: 1, weight: 40, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 40, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 40, reps: 10, rir: 2, completed: true }
          ]
        }
      ]
    },
    {
      routineId: 'pierna-fuerza',
      title: 'Pierna — Sentadilla & Peso Muerto',
      category: 'pierna',
      durationMinutes: 38,
      completedAt: dMinus3.toISOString(),
      totalVolume: 2200,
      maxWeight: 60,
      completedSetsCount: 8,
      watchMetrics: { avgBpm: 142, maxBpm: 172, caloriesBurned: 290 },
      exercises: [
        {
          id: 'back-squat',
          name: 'Sentadilla',
          sets: [
            { setNumber: 1, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 50, reps: 10, rir: 2, completed: true },
            { setNumber: 4, weight: 50, reps: 10, rir: 2, completed: true }
          ]
        },
        {
          id: 'deadlift',
          name: 'Peso muerto',
          sets: [
            { setNumber: 1, weight: 60, reps: 8, rir: 2, completed: true },
            { setNumber: 2, weight: 60, reps: 8, rir: 2, completed: true },
            { setNumber: 3, weight: 60, reps: 8, rir: 2, completed: true },
            { setNumber: 4, weight: 60, reps: 8, rir: 2, completed: true }
          ]
        }
      ]
    },
    {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 42,
      completedAt: dMinus7.toISOString(),
      totalVolume: 2260,
      maxWeight: 57.5,
      completedSetsCount: 10,
      watchMetrics: { avgBpm: 132, maxBpm: 160, caloriesBurned: 245 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 57.5, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 57.5, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 57.5, reps: 10, rir: 2, completed: true },
            { setNumber: 4, weight: 57.5, reps: 9, rir: 1, completed: true }
          ]
        },
        {
          id: 'barbell-row',
          name: 'Remo con barra',
          sets: [
            { setNumber: 1, weight: 37.5, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 37.5, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 37.5, reps: 10, rir: 2, completed: true }
          ]
        }
      ]
    },
    {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 40,
      completedAt: dMinus11.toISOString(),
      totalVolume: 2150,
      maxWeight: 55,
      completedSetsCount: 10,
      watchMetrics: { avgBpm: 130, maxBpm: 158, caloriesBurned: 230 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 55, reps: 10, rir: 2, completed: true },
            { setNumber: 2, weight: 55, reps: 10, rir: 2, completed: true },
            { setNumber: 3, weight: 55, reps: 10, rir: 2, completed: true },
            { setNumber: 4, weight: 55, reps: 10, rir: 2, completed: true }
          ]
        }
      ]
    }
  ]
}
