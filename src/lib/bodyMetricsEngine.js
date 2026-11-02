/**
 * Motor de Cálculo Antropométrico & Composición Corporal para IRON
 */

/**
 * Fórmula de la Marina de EE.UU. (US Navy Body Fat Formula)
 * Hombres: % Grasa = 495 / (1.0324 - 0.19077 * log10(cintura - cuello) + 0.15456 * log10(altura)) - 450
 * Todas las medidas en centímetros.
 */
export function calculateBodyFatNavy({ waist, neck = 39, height = 175 }) {
  const w = Number(waist) || 0
  const n = Number(neck) || 39
  const h = Number(height) || 175

  if (w <= 0 || h <= 0 || w <= n) return null

  try {
    const diff = w - n
    if (diff <= 0) return null

    const logDiff = Math.log10(diff)
    const logHeight = Math.log10(h)

    const denominator = 1.0324 - 0.19077 * logDiff + 0.15456 * logHeight
    if (denominator <= 0) return null

    const bodyFat = 495 / denominator - 450
    return Math.max(5, Math.min(45, Math.round(bodyFat * 10) / 10))
  } catch (e) {
    return null
  }
}

/**
 * Calcula la relación Cintura / Estatura (Waist-to-Height Ratio - WHtR)
 * Indicador de riesgo cardiometabólico y distribución de grasa visceral.
 */
export function calculateWaistToHeightRatio(waist, height = 175) {
  const w = Number(waist) || 0
  const h = Number(height) || 175
  if (w <= 0 || h <= 0) return null

  const ratio = Math.round((w / h) * 100) / 100
  let label = 'Óptimo / Atlético'
  let color = 'text-emerald-600 bg-emerald-50'

  if (ratio < 0.4) {
    label = 'Muy delgado'
    color = 'text-amber-600 bg-amber-50'
  } else if (ratio <= 0.49) {
    label = 'Excelente / Atlético'
    color = 'text-emerald-600 bg-emerald-50'
  } else if (ratio <= 0.54) {
    label = 'Moderado'
    color = 'text-amber-600 bg-amber-50'
  } else {
    label = 'Elevado'
    color = 'text-rose-600 bg-rose-50'
  }

  return { ratio, label, color }
}

/**
 * Calcula el índice V-Taper (Pecho / Cintura)
 * Ideal estético en culturismo natural: > 1.25
 */
export function calculateChestToWaistRatio(chest, waist) {
  const c = Number(chest) || 0
  const w = Number(waist) || 0
  if (c <= 0 || w <= 0) return null

  const ratio = Math.round((c / w) * 100) / 100
  let label = 'Forma en V'
  if (ratio >= 1.25) label = 'V-Taper Marcado'
  else if (ratio >= 1.15) label = 'Atlético'
  else label = 'Neutro'

  return { ratio, label }
}

/**
 * Calcula la masa magra y masa grasa en kg
 */
export function calculateMassBreakdown(weight, bodyFatPct) {
  const w = Number(weight) || 0
  const bf = Number(bodyFatPct) || 0
  if (w <= 0 || bf <= 0) return null

  const fatKg = Math.round(((w * bf) / 100) * 10) / 10
  const leanKg = Math.round((w - fatKg) * 10) / 10

  return { fatKg, leanKg }
}

/**
 * Genera puntos de media móvil para suavizar fluctuaciones de agua/glucógeno
 */
export function computeWeightTrend(entries = []) {
  if (entries.length === 0) return []

  // Ordenar de más antiguo a más reciente
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return sorted.map((entry, index) => {
    // Tomar los últimos 3 registros para la media móvil
    const start = Math.max(0, index - 2)
    const windowEntries = sorted.slice(start, index + 1)
    const avg =
      windowEntries.reduce((sum, e) => sum + Number(e.weight), 0) / windowEntries.length

    return {
      ...entry,
      trendWeight: Math.round(avg * 10) / 10
    }
  })
}

/**
 * Datos semilla realistas de evolución corporal para Angel:
 * Refleja una recomposición/volumen limpio:
 * De 75.8 kg a 77.9 kg actual con aumento en pecho y brazo y reducción de cintura.
 */
export function getRealisticBodyMeasurementsSeed() {
  const now = new Date()
  const dToday = new Date(now)
  const dMinus10 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
  const dMinus25 = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
  const dMinus45 = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)
  const dMinus60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  return [
    {
      id: `meas-${dToday.getTime()}`,
      date: dToday.toISOString().split('T')[0],
      weight: 77.9,
      waist: 83.0,
      chest: 104.0,
      arm: 38.0,
      thigh: 58.5,
      neck: 39.0,
      height: 175,
      bodyFatPct: 16.2,
      notes: 'Pesaje en ayunas. Buen bombeo en pecho.'
    },
    {
      id: `meas-${dMinus10.getTime()}`,
      date: dMinus10.toISOString().split('T')[0],
      weight: 77.4,
      waist: 83.0,
      chest: 103.5,
      arm: 37.8,
      thigh: 58.0,
      neck: 39.0,
      height: 175,
      bodyFatPct: 16.4,
      notes: 'Constante en sobrecarga de 60 kg en banca.'
    },
    {
      id: `meas-${dMinus25.getTime()}`,
      date: dMinus25.toISOString().split('T')[0],
      weight: 76.8,
      waist: 83.5,
      chest: 102.5,
      arm: 37.5,
      thigh: 57.5,
      neck: 39.0,
      height: 175,
      bodyFatPct: 16.7,
      notes: 'Semana de adaptación a pesos de patio.'
    },
    {
      id: `meas-${dMinus45.getTime()}`,
      date: dMinus45.toISOString().split('T')[0],
      weight: 76.2,
      waist: 84.0,
      chest: 101.5,
      arm: 37.0,
      thigh: 57.0,
      neck: 39.0,
      height: 175,
      bodyFatPct: 17.1,
      notes: 'Inicio de rutina consistente de patio.'
    },
    {
      id: `meas-${dMinus60.getTime()}`,
      date: dMinus60.toISOString().split('T')[0],
      weight: 75.8,
      waist: 84.5,
      chest: 100.5,
      arm: 36.5,
      thigh: 56.5,
      neck: 39.0,
      height: 175,
      bodyFatPct: 17.5,
      notes: 'Punto de partida de mediciones.'
    }
  ]
}
