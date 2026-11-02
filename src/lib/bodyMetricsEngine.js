/**
 * Motor de Cálculo Antropométrico & Composición Corporal para IRON
 */

/**
 * Fórmula de la Marina de EE.UU. (US Navy Body Fat Formula)
 * Hombres: % Grasa = 495 / (1.0324 - 0.19077 * log10(cintura - cuello) + 0.15456 * log10(altura)) - 450
 * Todas las medidas en centímetros.
 */
export function calculateBodyFatNavy({ waist, neck = 44, height = 194 }) {
  const w = Number(waist) || 0
  const n = Number(neck) || 44
  const h = Number(height) || 194

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
export function calculateWaistToHeightRatio(waist, height = 194) {
  const w = Number(waist) || 0
  const h = Number(height) || 194
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
 * Atleta de fuerza de 194 cm y 120.0 kg.
 * Refleja una progresión consistente de volumen limpio y recomposición:
 * De 117.2 kg a 120.0 kg con aumento en pecho (120 -> 124 cm) y brazos (40.5 -> 42 cm),
 * con reducción de cintura y 19.6% de grasa corporal (fórmula Marina EE.UU.).
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
      weight: 120.0,
      waist: 99.0,
      chest: 124.0,
      arm: 42.0,
      thigh: 68.0,
      neck: 44.0,
      height: 194,
      bodyFatPct: 19.6,
      notes: 'Pesaje en ayunas (194 cm / 120 kg). Sesión de torso 6.420 kg.'
    },
    {
      id: `meas-${dMinus10.getTime()}`,
      date: dMinus10.toISOString().split('T')[0],
      weight: 119.5,
      waist: 99.5,
      chest: 123.5,
      arm: 41.8,
      thigh: 67.5,
      neck: 44.0,
      height: 194,
      bodyFatPct: 19.8,
      notes: 'Constante en sobrecarga de 60 kg en banca e inclinado.'
    },
    {
      id: `meas-${dMinus25.getTime()}`,
      date: dMinus25.toISOString().split('T')[0],
      weight: 118.8,
      waist: 100.0,
      chest: 122.5,
      arm: 41.5,
      thigh: 67.0,
      neck: 44.0,
      height: 194,
      bodyFatPct: 20.1,
      notes: 'Adaptación a cargas altas de barra de patio.'
    },
    {
      id: `meas-${dMinus45.getTime()}`,
      date: dMinus45.toISOString().split('T')[0],
      weight: 118.0,
      waist: 100.5,
      chest: 121.5,
      arm: 41.0,
      thigh: 66.5,
      neck: 44.0,
      height: 194,
      bodyFatPct: 20.4,
      notes: 'Consistencia en descanso 1:30 min y técnica estricta.'
    },
    {
      id: `meas-${dMinus60.getTime()}`,
      date: dMinus60.toISOString().split('T')[0],
      weight: 117.2,
      waist: 101.0,
      chest: 120.0,
      arm: 40.5,
      thigh: 66.0,
      neck: 44.0,
      height: 194,
      bodyFatPct: 20.8,
      notes: 'Punto de partida de mediciones.'
    }
  ]
}
