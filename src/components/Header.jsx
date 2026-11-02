import React from 'react'
import { Calendar, Flame, User, LogIn } from 'lucide-react'
import { APP_VERSION } from '../lib/constants'

export function Header({
  title = 'Home',
  streak = 1,
  onOpenCalendar,
  userSession = null,
  onOpenAuth
}) {
  return (
    <header className="flex items-center justify-between pt-1.5 pb-3">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black text-carbon-900 tracking-tight">
          {title}
        </h1>
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-sand-200/80 text-neutral-600 border border-sand-300/40">
          {APP_VERSION}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Botón de Autenticación Permanente */}
        {userSession ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-sand-100 border border-sand-200 flex items-center justify-center text-carbon-900 relative shadow-2xs"
            title={userSession.user?.email || 'Cuenta conectada'}
          >
            <User className="w-4 h-4 text-coral-500" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-sand-100 border border-sand-200/90 text-carbon-900 text-[11px] font-bold shadow-2xs transition-colors"
          >
            <LogIn className="w-3 h-3 text-coral-500" />
            <span>Entrar</span>
          </button>
        )}

        {/* Badge de racha */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-sand-200/80 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
          <span className="text-xs font-black text-carbon-900">{streak}</span>
        </div>

        {/* Botón calendario */}
        <button
          onClick={onOpenCalendar}
          className="w-8 h-8 rounded-full bg-white border border-sand-200/80 shadow-2xs flex items-center justify-center text-carbon-900 hover:bg-sand-100 transition-colors"
          aria-label="Abrir calendario"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}
