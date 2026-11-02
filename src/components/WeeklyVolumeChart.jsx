import React from 'react'
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

export function WeeklyVolumeChart({ volumeData }) {
  const weeks = volumeData?.weeks || []
  const maxVol = Math.max(...weeks.map((w) => w.volume), 1)

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            TONELAJE ACUMULADO
          </span>
          <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
            Volumen Semanal
          </h3>
        </div>

        {volumeData?.weekPercent !== 0 && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
              volumeData?.weekDiff >= 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-sand-100 text-neutral-600'
            }`}
          >
            {volumeData?.weekDiff >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {volumeData?.weekDiff >= 0 ? '+' : ''}
              {volumeData?.weekPercent}% vs sem anterior
            </span>
          </div>
        )}
      </div>

      {/* Título de Volumen Actual */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-carbon-900 font-mono tracking-tight">
          {(volumeData?.currentWeekVolume || 0).toLocaleString()}
        </span>
        <span className="text-xs font-bold text-neutral-400 uppercase">kg movidos esta semana</span>
      </div>

      {/* Gráfico de Barras Semanales */}
      <div className="pt-2 pb-1">
        <div className="grid grid-cols-4 gap-3 items-end h-32 px-2">
          {weeks.map((week, idx) => {
            const heightPercent = Math.max(12, Math.round((week.volume / maxVol) * 100))
            const isCurrentWeek = idx === weeks.length - 1

            return (
              <div key={week.label} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[9px] font-mono font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.round(week.volume / 1000)}t
                </span>

                <div className="w-full bg-sand-100 rounded-xl overflow-hidden flex flex-col justify-end p-1 h-24">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isCurrentWeek
                        ? 'bg-coral-500 shadow-sm shadow-coral-500/20'
                        : 'bg-carbon-900'
                    }`}
                  />
                </div>

                <div className="text-center">
                  <span
                    className={`text-[10px] font-bold block ${
                      isCurrentWeek ? 'text-coral-500 font-black' : 'text-neutral-500'
                    }`}
                  >
                    {week.label}
                  </span>
                  <span className="text-[8px] text-neutral-400 block font-medium">
                    {week.sessionsCount} ent.
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Promedio Semanal */}
      <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-coral-500" />
          <span className="font-bold text-carbon-900">Promedio por semana:</span>
        </div>
        <span className="font-mono font-black text-carbon-900">
          {(volumeData?.averageWeeklyVolume || 0).toLocaleString()} kg
        </span>
      </div>
    </div>
  )
}
