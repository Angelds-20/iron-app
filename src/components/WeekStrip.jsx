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
    <div className="w-full bg-[#212227] border border-[#2C2D34] rounded-3xl p-5 sm:p-6 shadow-xl mb-4 animate-fadeIn">
      {/* Resumen de Días y Botón de Descanso */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
            SEGUIMIENTO DIARIO
          </span>
          <div className="text-xs font-black text-white mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-white">
              <Dumbbell className="w-3.5 h-3.5 text-white" />
              <span>{workoutsCount || 1} entreno</span>
              <span className="text-[10px] text-zinc-400 font-normal">(ayer)</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Moon className="w-3.5 h-3.5 text-white" />
              <span>{restsCount || 1} descanso</span>
              <span className="text-[10px] text-zinc-400 font-normal">(hoy)</span>
            </span>
          </div>
        </div>

        {/* Estado interactivo de hoy */}
        {onLogRestDay && (
          <button
            type="button"
            onClick={onLogRestDay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              isTodayRest
                ? 'bg-white text-black font-black shadow-lg shadow-white/20'
                : 'bg-[#1A1B20] text-zinc-400 hover:text-white border border-[#2C2D34]'
            }`}
            title="Alternar día de descanso / entreno para hoy"
          >
            <Moon className={`w-3.5 h-3.5 ${isTodayRest ? 'text-black' : 'text-white'}`} />
            <span>{isTodayRest ? 'Hoy: Descanso' : 'Marcar Descanso'}</span>
          </button>
        )}
      </div>

      {/* Grid de 7 Días */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {days.map((item, idx) => {
          let circleStyle = 'bg-[#1A1B20] text-zinc-400 hover:text-white border border-[#2C2D34]'
          let icon = null

          if (item.isCompleted) {
            circleStyle = item.isToday
              ? 'bg-white text-black font-black ring-2 ring-white/50 shadow-lg scale-105'
              : 'bg-white text-black font-black shadow-md scale-100'
            icon = <Dumbbell className="w-2.5 h-2.5 text-black" />
          } else if (item.isRest) {
            circleStyle = item.isToday
              ? 'bg-[#1A1B20] text-white font-black ring-2 ring-white/40 border border-white/60 shadow-lg scale-105'
              : 'bg-[#1A1B20] text-zinc-300 font-bold border border-[#2C2D34]'
            icon = <Moon className="w-2.5 h-2.5 text-white" />
          } else if (item.isToday) {
            circleStyle = 'bg-white text-black font-black shadow-lg shadow-white/20'
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span
                className={`text-[10px] font-black tracking-wider uppercase ${
                  item.isToday ? 'text-white' : item.isYesterday ? 'text-zinc-300' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
              <div
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-xs transition-all duration-200 ${circleStyle}`}
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
