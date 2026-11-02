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
    <header className="flex items-center justify-between pt-1 pb-3 mb-2 animate-fade-in">
      {/* Lado izquierdo: Logo & Título cliqueable que lleva a Home */}
      <button
        type="button"
        onClick={onGoHome}
        className="flex items-center gap-2.5 text-left group cursor-pointer transition-transform active:scale-95"
        title="Ir a Inicio (Home)"
      >
        <div className="w-9 h-9 rounded-2xl bg-[#22222A] text-coral-500 flex items-center justify-center font-black text-xs tracking-tighter shadow-md group-hover:bg-coral-500 group-hover:text-white transition-all">
          IR
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block -mb-0.5">
            IRON TRACKER
          </span>
          <h1 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-coral-500 transition-colors">
            {title}
          </h1>
        </div>
      </button>

      {/* Lado derecho: Racha + Perfil de Atleta (Angel) + Calendario */}
      <div className="flex items-center gap-2">
        {/* Badge de Racha */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181D] shadow-md transition-transform hover:scale-105"
          title={`Racha actual: ${streak} días seguidos`}
        >
          <Flame className="w-3.5 h-3.5 text-coral-500 fill-coral-500 animate-pulse-subtle" />
          <span className="text-xs font-black text-white font-mono">{streak}</span>
          <span className="text-[10px] font-normal text-zinc-500">d</span>
        </div>

        {/* Perfil del Atleta: Angel */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-[#18181D] hover:bg-[#22222A] shadow-md transition-all cursor-pointer group active:scale-95"
          title={userSession ? `Conectado como ${userSession.user?.email}` : 'Perfil de Angel (Toca para nube y ajustes)'}
        >
          <div className="w-6 h-6 rounded-full bg-[#262631] text-white flex items-center justify-center text-[10px] font-black group-hover:bg-coral-500 transition-colors">
            A
          </div>
          <span className="text-xs font-bold text-zinc-200">Angel</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${userSession ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-emerald-400'}`}
          />
        </button>

        {/* Botón calendario / historial */}
        {onOpenCalendar && (
          <button
            type="button"
            onClick={onOpenCalendar}
            className="w-8 h-8 rounded-full bg-[#18181D] shadow-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#22222A] transition-all cursor-pointer active:scale-95"
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
