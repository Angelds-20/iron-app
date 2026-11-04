/**
 * Retorna la fecha local en formato YYYY-MM-DD (Zona Horaria Local de Chile)
 * Evita el bug crítico de toISOString() que después de las 21:00 hrs salta al día siguiente (UTC).
 */
export function getLocalDateString(d = new Date()) {
  const dateObj = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getYesterdayLocalDateString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getLocalDateString(d)
}
