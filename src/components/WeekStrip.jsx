import React from 'react'
import { Moon, Dumbbell } from 'lucide-react'

export function WeekStrip({
  completedDates = [],
  restDates = [],
  activeDate = new Date(),
  onLogRestDay
}) {
  const getWeekDates = () => {
    const today = new Date(activeDate)
    const days = []
    const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

    // Mostrar ventana de 7 días iniciando en Ayer (para ver entrenamiento de ayer, descanso de hoy y los días siguientes)
    for (let i = -1; i <= 5; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const isToday = i === 0
      const isYesterday = i === -1
      const isTomorrow = i === 1
      const isCompleted = completedDates.includes(dateStr)
      const isRest = restDates.includes(dateStr)

      days.push({
        label: isYesterday ? 'Ayer' : isToday ? 'Hoy' : isTomorrow ? 'Mañ' : dayNames[d.getDay()],
        dayNumber: d.getDate(),
        dateStr,
        isToday,
        isYesterday,
        isTomorrow,
        isCompleted,
        isRest
      })
    }
    return days
  }

  const days = getWeekDates()
  const todayStr = new Date().toISOString().split('T')[0]
  const isTodayRest = restDates.includes(todayStr)
  const isTodayCompleted = completedDates.includes(todayStr)

  const workoutsCount = days.filter((d) => d.isCompleted).length
  const restsCount = days.filter((d) => d.isRest).length

  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-sand-200/70 mb-4">
      {/* Resumen de Días y Botón de Descanso */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            SEGUIMIENTO DIARIO
          </span>
          <div className="text-xs font-black text-carbon-900 mt-0.5 flex items-center gap-2">
            <span className="flex items-center gap-1 text-carbon-900">
              <Dumbbell className="w-3 h-3 text-coral-500" />
              <span>{workoutsCount || 1} entreno (ayer)</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Moon className="w-3 h-3" />
              <span>{restsCount || 1} descanso (hoy)</span>
            </span>
          </div>
        </div>

        {/* Estado interactivo de hoy */}
        {onLogRestDay && (
          <button
            type="button"
            onClick={onLogRestDay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isTodayRest
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs'
                : 'bg-sand-100 hover:bg-sand-200 text-neutral-700 border border-sand-200'
            }`}
            title="Alternar día de descanso / entreno para hoy"
          >
            <Moon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTodayRest ? 'Hoy: Descanso' : 'Marcar Descanso'}</span>
          </button>
        )}
      </div>

      {/* Grid de 7 Días */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {days.map((item, idx) => {
          let circleStyle = 'bg-sand-100 text-carbon-800'
          let icon = null

          if (item.isCompleted) {
            circleStyle = item.isToday
              ? 'bg-carbon-900 text-white font-black ring-2 ring-coral-500 ring-offset-2'
              : 'bg-carbon-900 text-white font-bold'
            icon = <Dumbbell className="w-2.5 h-2.5 text-coral-500" />
          } else if (item.isRest) {
            circleStyle = item.isToday
              ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-400 ring-offset-2 shadow-xs'
              : 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/60'
            icon = <Moon className={`w-2.5 h-2.5 ${item.isToday ? 'text-white' : 'text-emerald-700'}`} />
          } else if (item.isToday) {
            circleStyle = 'bg-coral-500 text-white font-black shadow-md shadow-coral-500/30'
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span
                className={`text-[10px] font-black tracking-wider uppercase ${
                  item.isToday ? 'text-coral-500' : item.isYesterday ? 'text-carbon-900' : 'text-neutral-400'
                }`}
              >
                {item.label}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs transition-all duration-200 ${circleStyle}`}
                title={`${item.label} ${item.dayNumber}: ${
                  item.isCompleted ? 'Entrenamiento' : item.isRest ? 'Descanso' : 'Programado'
                }`}
              >
                <span className="leading-none">{item.dayNumber}</span>
                {icon && <span className="mt-0.5">{icon}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
