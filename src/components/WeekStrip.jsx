import React from 'react'
import { Moon, ShieldCheck, Flame } from 'lucide-react'

export function WeekStrip({
  completedDates = [],
  restDates = [],
  activeDate = new Date(),
  onLogRestDay
}) {
  const getWeekDates = () => {
    const today = new Date(activeDate)
    const dayOfWeek = today.getDay()
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek

    const monday = new Date(today)
    monday.setDate(today.getDate() + diffToMonday)

    const days = []
    const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const isToday = d.toDateString() === today.toDateString()
      const isCompleted = completedDates.includes(dateStr)
      const isRest = restDates.includes(dateStr)

      days.push({
        label: dayLabels[i],
        dayNumber: d.getDate(),
        dateStr,
        isToday,
        isCompleted,
        isRest
      })
    }
    return days
  }

  const days = getWeekDates()
  const todayStr = new Date().toISOString().split('T')[0]
  const isTodayLogged = completedDates.includes(todayStr) || restDates.includes(todayStr)

  const workoutsThisWeek = days.filter((d) => d.isCompleted).length
  const restsThisWeek = days.filter((d) => d.isRest).length

  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-sand-200/60 mb-5">
      {/* Resumen de Días y Botón de Descanso */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
            ESTA SEMANA
          </span>
          <div className="text-xs font-bold text-carbon-900 mt-0.5">
            {workoutsThisWeek} entrenos • {restsThisWeek} descansos
          </div>
        </div>

        {!isTodayLogged && onLogRestDay && (
          <button
            type="button"
            onClick={onLogRestDay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[11px] font-bold transition-colors"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Hoy Descanso</span>
          </button>
        )}
      </div>

      {/* Grid de 7 Días */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((item, idx) => {
          let circleStyle = 'bg-sand-100 text-carbon-800'
          let extraIcon = null

          if (item.isToday) {
            circleStyle = 'bg-coral-500 text-white font-black shadow-md shadow-coral-500/30'
          } else if (item.isCompleted) {
            circleStyle = 'bg-carbon-900 text-white font-bold'
          } else if (item.isRest) {
            circleStyle = 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/60'
            extraIcon = <Moon className="w-2.5 h-2.5 inline-block -mt-1 ml-0.5" />
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase">
                {item.label}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${circleStyle}`}
              >
                <span>{item.dayNumber}</span>
                {extraIcon}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
