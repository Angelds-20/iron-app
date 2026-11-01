import React from 'react'
import { Activity, Dumbbell, Flame, HeartPulse } from 'lucide-react'

export function SessionMetricsCard({
  totalVolume = 0,
  targetVolume = 2500,
  avgBpm = 135,
  maxBpm = 162,
  activeCalories = 240
}) {
  const volumePercent = Math.min(100, Math.round((totalVolume / targetVolume) * 100))

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {/* Tarjeta Volumen Levantado (Mantiene el indicador circular de la referencia) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            VOLUMEN TOTAL
          </span>
        </div>

        {/* Círculo indicador igual a la imagen de referencia */}
        <div className="flex justify-center my-3">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-sand-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-coral-500 transition-all duration-500 stroke-current"
                strokeDasharray={`${volumePercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-carbon-900">
              {volumePercent}%
            </span>
          </div>
        </div>

        <div>
          <div className="text-center">
            <span className="text-base font-bold text-coral-500">{totalVolume}</span>
            <span className="text-neutral-400 text-xs font-semibold"> / {targetVolume}</span>
            <div className="text-[10px] text-neutral-400 font-medium">kg levantados</div>
          </div>
        </div>
      </div>

      {/* Tarjeta Métricas Honor Choice Watch 2i */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between">
        {/* Pulsaciones Promedio */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[9px] tracking-wider text-neutral-400 uppercase">PULSO HONOR WATCH</span>
            <span className="font-semibold text-carbon-800 text-[11px]">
              {avgBpm} <span className="text-neutral-400 font-normal">BPM</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (avgBpm / 180) * 100)}%` }}
            />
          </div>
        </div>

        {/* Pico Cardíaco */}
        <div className="my-2">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[9px] tracking-wider text-neutral-400 uppercase">PICO MÁXIMO</span>
            <span className="font-semibold text-carbon-800 text-[11px]">
              {maxBpm} <span className="text-neutral-400 font-normal">BPM</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-carbon-800 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (maxBpm / 200) * 100)}%` }}
            />
          </div>
        </div>

        {/* Calorías Activas del Reloj */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[9px] tracking-wider text-neutral-400 uppercase">CALORÍAS ACTIVAS</span>
            <span className="font-semibold text-carbon-800 text-[11px]">
              {activeCalories} <span className="text-neutral-400 font-normal">kcal</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (activeCalories / 500) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
