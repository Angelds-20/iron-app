import React, { useState } from 'react'
import { TrendingUp, ArrowUpRight, Scale, Check, ChevronRight } from 'lucide-react'

export function BodyweightCard({ weight = 77.9, onUpdateWeight, onOpenEvolution }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempWeight, setTempWeight] = useState(weight)

  const handleSave = () => {
    if (onUpdateWeight) {
      onUpdateWeight(Number(tempWeight))
    }
    setIsEditing(false)
  }

  // Alturas relativas simuladas para el mini gráfico semanal
  const weeklyBars = [
    { day: 'L', height: 40, active: false },
    { day: 'M', height: 45, active: false },
    { day: 'M', height: 35, active: false },
    { day: 'J', height: 50, active: false },
    { day: 'V', height: 48, active: false },
    { day: 'S', height: 65, active: true }, // Día actual o pico en coral
    { day: 'D', height: 30, active: false }
  ]

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-xs border border-sand-200/60 mb-5">
      <div className="flex items-center justify-between">
        {/* Lado izquierdo: Peso actual */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              PESO CORPORAL
            </span>
            {onOpenEvolution && (
              <button
                type="button"
                onClick={onOpenEvolution}
                className="text-[10px] font-black text-coral-500 hover:text-coral-600 flex items-center gap-0.5 ml-1 cursor-pointer"
              >
                <span>Medidas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                step="0.1"
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
                className="w-24 text-2xl font-extrabold bg-sand-100 rounded-xl px-2 py-1 outline-none border border-sand-300"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-2 bg-carbon-900 text-white rounded-xl hover:bg-black transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="cursor-pointer group flex items-baseline gap-1"
            >
              <span className="text-3xl font-extrabold tracking-tight text-carbon-900">
                {weight}
              </span>
              <span className="text-base font-semibold text-neutral-500">kg</span>
            </div>
          )}

          <div
            onClick={onOpenEvolution}
            className={`flex items-center gap-1 mt-1 text-xs font-semibold text-coral-500 ${
              onOpenEvolution ? 'cursor-pointer hover:underline' : ''
            }`}
          >
            <span>Esta semana</span>
            <span className="font-bold">+1.0 kg</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Lado derecho: Mini gráfico de barras semanal */}
        <div
          onClick={onOpenEvolution}
          className={`flex flex-col items-end ${onOpenEvolution ? 'cursor-pointer group' : ''}`}
        >
          <div className="flex items-end gap-2 h-14 pb-1">
            {weeklyBars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-2 h-12 bg-sand-100 rounded-full flex items-end overflow-hidden">
                  <div
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-full transition-all duration-300 ${
                      bar.active ? 'bg-coral-500' : 'bg-sand-300'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold text-neutral-400">
            {weeklyBars.map((bar, i) => (
              <span key={i} className="w-2 text-center">
                {bar.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
