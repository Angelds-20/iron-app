import React from 'react'
import { PieChart, Layers, Target } from 'lucide-react'

const MUSCLE_BAR_COLORS = {
  Pecho: 'bg-white',
  Espalda: 'bg-zinc-400',
  Pierna: 'bg-zinc-200',
  Hombros: 'bg-zinc-500',
  Brazos: 'bg-zinc-300'
}

export function MuscleDistributionCard({ distributionData }) {
  const items = distributionData?.items || []
  const totalSets = distributionData?.totalSets || 0

  return (
    <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34] space-y-3.5 text-white">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            ESTÍMULO & BALANCE
          </span>
          <h3 className="text-base font-black text-white leading-tight mt-0.5">
            Frecuencia Muscular
          </h3>
        </div>

        <span className="text-[10px] font-black text-white bg-[#1A1B20] border border-[#2C2D34] px-3 py-1 rounded-full uppercase">
          {totalSets} Series Totales
        </span>
      </div>

      {/* Barra segmentada de distribución */}
      <div className="w-full h-3 rounded-full bg-[#1A1B20] border border-[#2C2D34] overflow-hidden flex gap-0.5 p-0.5">
        {items.map((item) => {
          if (item.percentage <= 0) return null
          const barColor = MUSCLE_BAR_COLORS[item.name] || 'bg-white'
          return (
            <div
              key={item.name}
              style={{ width: `${item.percentage}%` }}
              className={`h-full rounded-sm ${barColor} transition-all`}
              title={`${item.name}: ${item.percentage}%`}
            />
          )
        })}
      </div>

      {/* Grid de desglose por grupo muscular */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {items.map((item) => {
          const colorClass = MUSCLE_BAR_COLORS[item.name] || 'bg-white'

          return (
            <div
              key={item.name}
              className="p-3 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                <span className="text-xs font-bold text-white">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-white font-mono">
                  {item.percentage}%
                </span>
                <span className="text-[9px] text-zinc-400 font-medium block">
                  {item.sets} series
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
