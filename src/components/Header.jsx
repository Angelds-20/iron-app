import React from 'react'
import { Calendar, Flame, User, Cloud, CheckCircle2 } from 'lucide-react'
import { APP_VERSION } from '../lib/constants'

export function Header({
  title = 'Home',
  streak = 1,
  onOpenCalendar,
  userSession = null,
  onOpenAuth,
  onGoHome
}) {
  return (
    <header className="flex items-center justify-between pt-1 pb-3 mb-1">
      {/* Lado izquierdo: Logo & Título cliqueable que lleva a Home */}
      <button
        type="button"
        onClick={onGoHome}
        className="flex items-center gap-2.5 text-left group cursor-pointer transition-transform active:scale-95"
        title="Ir a Inicio (Home)"
      >
        <div className="w-8 h-8 rounded-xl bg-carbon-900 text-coral-500 flex items-center justify-center font-black text-xs tracking-tighter shadow-sm group-hover:bg-black transition-colors">
          IR
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block -mb-0.5">
            IRON TRACKER
          </span>
          <h1 className="text-xl font-black text-carbon-900 tracking-tight leading-tight group-hover:text-coral-600 transition-colors">
            {title}
          </h1>
        </div>
      </button>

      {/* Lado derecho: Racha + Perfil de Atleta (Angel) + Calendario */}
      <div className="flex items-center gap-2">
        {/* Badge de Racha */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-sand-200/80 shadow-2xs"
          title={`Racha actual: ${streak} días seguidos`}
        >
          <Flame className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
          <span className="text-xs font-black text-carbon-900 font-mono">{streak}</span>
          <span className="text-[10px] font-bold text-neutral-400">d</span>
        </div>

        {/* Perfil del Atleta: Angel (Sin botón confuso 'Entrar') */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white border border-sand-200/80 hover:border-carbon-900 shadow-2xs transition-all cursor-pointer group"
          title={userSession ? `Conectado como ${userSession.user?.email}` : 'Perfil de Angel (Toca para nube y ajustes)'}
        >
          <div className="w-6 h-6 rounded-full bg-carbon-900 text-white flex items-center justify-center text-[10px] font-black group-hover:bg-coral-500 transition-colors">
            A
          </div>
          <span className="text-xs font-bold text-carbon-900">Angel</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${userSession ? 'bg-emerald-500' : 'bg-emerald-400'}`}
          />
        </button>

        {/* Botón calendario / historial */}
        {onOpenCalendar && (
          <button
            type="button"
            onClick={onOpenCalendar}
            className="w-8 h-8 rounded-full bg-white border border-sand-200/80 shadow-2xs flex items-center justify-center text-carbon-900 hover:bg-sand-100 transition-colors cursor-pointer"
            aria-label="Abrir entrenamientos"
            title="Ir a Entrenar"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  )
}
