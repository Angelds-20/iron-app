import React from 'react'
import { SlidersHorizontal, Plus } from 'lucide-react'

export function Header({
  title = 'Workouts',
  streak = 1,
  onOpenCalendar,
  userSession = null,
  onOpenAuth,
  onGoHome
}) {
  const displayTitle = title === 'Home' ? 'Workouts' : title

  return (
    <header className="flex items-center justify-between pt-1 pb-4 mb-3 animate-fade-in">
      {/* Título blanco masivo y nítido */}
      <button
        type="button"
        onClick={onGoHome}
        className="text-left group cursor-pointer transition-transform active:scale-95"
        title="Ir a Workouts"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">
          {displayTitle}
        </h1>
      </button>

      {/* Los 2 botones circulares con toque blanco de alto contraste */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenCalendar}
          className="w-11 h-11 rounded-full bg-[#212227] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all cursor-pointer touch-press shadow-md"
          title="Filtros y Entrenamientos"
          aria-label="Filtros y Entrenamientos"
        >
          <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={onOpenAuth}
          className="w-11 h-11 rounded-full bg-[#212227] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all cursor-pointer touch-press shadow-md"
          title="Añadir / Perfil de Angel"
          aria-label="Perfil de Angel"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </header>
  )
}
