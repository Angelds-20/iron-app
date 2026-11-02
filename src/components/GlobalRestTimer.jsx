import React from 'react'
import { Clock, Plus, Check } from 'lucide-react'

export function GlobalRestTimer({
  restSeconds = 0,
  onAddRestTime,
  onCancelRest,
  onOpenWorkout
}) {
  if (restSeconds <= 0) return null

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none animate-fadeIn">
      <div className="pointer-events-auto bg-carbon-900/95 backdrop-blur-md text-white rounded-full px-4 py-2.5 shadow-xl border border-carbon-800 flex items-center justify-between gap-3 max-w-sm w-full">
        {/* Lado izquierdo: tiempo y acceso directo a la rutina */}
        <div
          onClick={onOpenWorkout}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-carbon-800 flex items-center justify-center text-coral-500">
            <Clock className="w-3.5 h-3.5 animate-spin" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              DESCANSO EN CURSO
            </div>
            <div className="text-base font-black font-mono text-coral-500 leading-tight">
              {formatTime(restSeconds)}
            </div>
          </div>
        </div>

        {/* Lado derecho: Botones rápidos */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAddRestTime(30)}
            className="px-2.5 py-1.5 rounded-full bg-carbon-800 hover:bg-carbon-700 text-[11px] font-bold text-neutral-300 transition-colors"
          >
            +30s
          </button>
          <button
            type="button"
            onClick={onCancelRest}
            className="px-3 py-1.5 rounded-full bg-sand-100 hover:bg-white text-carbon-900 text-[11px] font-extrabold transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  )
}
