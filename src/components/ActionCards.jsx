import React from 'react'
import { Dumbbell, ArrowRight, Flame, Watch, Play, Clock, Sparkles, Trash2 } from 'lucide-react'

export function ActionCards({
  onStartWorkout,
  onOpenWatchModal,
  lastWatchData,
  activeSession,
  onDiscardActiveSession
}) {
  // Contar series completadas si hay sesión activa
  const completedSetsCount = activeSession?.exerciseData
    ? Object.values(activeSession.exerciseData).flatMap((sets) => sets).filter((s) => s.completed).length
    : 0

  return (
    <div className="space-y-3 mb-6">
      {/* Banner de Sesión en Curso si hay entrenamiento activo */}
      {activeSession?.isActive && (
        <div className="bg-carbon-900 text-white rounded-3xl p-5 shadow-lg shadow-carbon-900/15 border border-carbon-800 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div
              onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
              className="cursor-pointer flex-1 pr-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-coral-500 animate-pulse" />
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-coral-500">
                  SESIÓN EN PROGRESO
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                {activeSession.routineIndex === 1
                  ? 'Pierna — Sentadilla & Peso Muerto'
                  : 'Torso — Banca & Inclinado'}
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                {completedSetsCount} series registradas • Toca para continuar
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
                className="px-3.5 py-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-black flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onDiscardActiveSession && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDiscardActiveSession()
                  }}
                  className="p-2 rounded-full bg-carbon-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors"
                  title="Descartar sesión no guardada"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
          RUTINAS DE PATIO
        </span>
        <span className="text-[11px] font-semibold text-neutral-400">1-Tap para entrenar</span>
      </div>

      {/* Tarjeta 1: Torso (Banca, Inclinado, Remo, Francés, Curl) */}
      <div
        onClick={() => onStartWorkout(0)}
        className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 cursor-pointer active:scale-[0.98] transition-all hover:border-carbon-900 group relative overflow-hidden"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 border border-sand-200/60 group-hover:bg-carbon-900 group-hover:text-white transition-colors">
              <Dumbbell className="w-5 h-5 text-coral-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-coral-500 tracking-wider uppercase">
                5 EJERCICIOS • 40 MIN
              </div>
              <h3 className="text-base font-extrabold text-carbon-900">
                Torso — Banca & Inclinado
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Banca plana, inclinado, remo, francés y curl
              </p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-carbon-900 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-coral-500 transition-colors shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Pierna (Sentadilla & Peso Muerto) */}
      <div
        onClick={() => onStartWorkout(1)}
        className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 cursor-pointer active:scale-[0.98] transition-all hover:border-carbon-900 group relative overflow-hidden"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 border border-sand-200/60 group-hover:bg-carbon-900 group-hover:text-white transition-colors">
              <Flame className="w-5 h-5 text-coral-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-coral-500 tracking-wider uppercase">
                2 EJERCICIOS • 35 MIN
              </div>
              <h3 className="text-base font-extrabold text-carbon-900">
                Pierna — Sentadilla & Peso Muerto
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Sentadilla desde banco y peso muerto 60 kg
              </p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-carbon-900 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-coral-500 transition-colors shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tarjeta Honor Choice Watch 2i compacta */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-sand-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Watch className="w-4 h-4 text-coral-500" />
          <div className="text-xs">
            <span className="font-bold text-carbon-900">Honor Watch 2i: </span>
            <span className="text-neutral-500">
              {lastWatchData?.avgBpm ? `${lastWatchData.avgBpm} BPM` : 'Listo para sincronizar'}
            </span>
          </div>
        </div>
        <button
          onClick={onOpenWatchModal}
          className="text-[11px] font-bold text-coral-500 hover:underline"
        >
          Ajustar
        </button>
      </div>
    </div>
  )
}
