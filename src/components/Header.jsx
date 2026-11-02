import React from 'react'
import { Calendar, Flame } from 'lucide-react'
import { APP_VERSION } from '../lib/constants'

export function Header({ title = 'Home', streak = 1, onOpenCalendar }) {
  return (
    <header className="flex items-center justify-between pt-2 pb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-extrabold text-carbon-900 tracking-tight">
          {title}
        </h1>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sand-200/80 text-neutral-600 border border-sand-300/40">
          {APP_VERSION}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Badge de racha sutil */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-sand-200/80 shadow-xs">
          <Flame className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
          <span className="text-xs font-bold text-carbon-900">{streak}</span>
        </div>

        {/* Botón calendario como en la imagen de referencia */}
        <button
          onClick={onOpenCalendar}
          className="w-10 h-10 rounded-full bg-white border border-sand-200/80 shadow-xs flex items-center justify-center text-carbon-900 hover:bg-sand-100 transition-colors"
          aria-label="Abrir calendario"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
