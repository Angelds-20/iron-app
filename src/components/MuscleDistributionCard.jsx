import React from 'react'
import { PieChart, Layers, Target } from 'lucide-react'

const MUSCLE_COLORS = {
  Pecho: 'bg-coral-500 text-coral-600',
  Espalda: 'bg-carbon-900 text-carbon-900',
  Pierna: 'bg-amber-500 text-amber-600',
  Hombros: 'bg-emerald-500 text-emerald-600',
  Brazos: 'bg-blue-500 text-blue-600'
}

const MUSCLE_BAR_COLORS = {
  Pecho: 'bg-coral-500',
  Espalda: 'bg-carbon-900',
  Pierna: 'bg-amber-500',
  Hombros: 'bg-emerald-500',
  Brazos: 'bg-blue-500'
}

export function MuscleDistributionCard({ distributionData }) {
  const items = distributionData?.items || []
  const totalSets = distributionData?.totalSets || 0

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            ESTÍMULO & BALANCE
          </span>
          <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
            Frecuencia Muscular
          </h3>
        </div>

        <span className="text-[10px] font-black text-neutral-400 bg-sand-100 px-2.5 py-1 rounded-full uppercase">
          {totalSets} Series Totales
        </span>
      </div>

      {/* Barra segmentada de distribución */}
      <div className="w-full h-3 rounded-full bg-sand-100 overflow-hidden flex gap-0.5 p-0.5">
        {items.map((item) => {
          if (item.percentage <= 0) return null
          const barColor = MUSCLE_BAR_COLORS[item.name] || 'bg-neutral-400'
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
          const colorClass = MUSCLE_BAR_COLORS[item.name] || 'bg-neutral-400'

          return (
            <div
              key={item.name}
              className="p-2.5 rounded-2xl bg-sand-50 border border-sand-200/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                <span className="text-xs font-bold text-carbon-900">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-carbon-900 font-mono">
                  {item.percentage}%
                </span>
                <span className="text-[9px] text-neutral-400 font-medium block">
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
