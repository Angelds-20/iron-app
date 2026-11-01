import React from 'react'

export function WeekStrip({ completedDates = [], activeDate = new Date() }) {
  // Generar los 7 días de la semana actual (Lunes a Domingo)
  const getWeekDates = () => {
    const today = new Date(activeDate)
    const dayOfWeek = today.getDay() // 0 = Domingo, 1 = Lunes...
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

      days.push({
        label: dayLabels[i],
        dayNumber: d.getDate(),
        dateStr,
        isToday,
        isCompleted
      })
    }
    return days
  }

  const days = getWeekDates()

  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-sm border border-sand-200/60 mb-5">
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((item, idx) => {
          let circleStyle = 'bg-sand-100 text-carbon-800'
          if (item.isToday) {
            circleStyle = 'bg-coral-500 text-white font-bold shadow-md shadow-coral-500/30'
          } else if (item.isCompleted) {
            circleStyle = 'bg-carbon-900 text-white font-semibold'
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                {item.label}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${circleStyle}`}
              >
                {item.dayNumber}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
