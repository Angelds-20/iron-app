import React from 'react'
import { Dumbbell, ArrowRight, Flame, Watch } from 'lucide-react'
import { APP_IMAGES } from '../lib/constants'

export function ActionCards({ onStartWorkout, onOpenWatchModal, lastWatchData }) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
          COMENZAR AHORA
        </span>
        <span className="text-[11px] font-semibold text-neutral-400">1-Tap para entrenar</span>
      </div>

      {/* Tarjeta 1: Torso (Banca, Inclinado, Remo, Francés, Curl) */}
      <div
        onClick={() => onStartWorkout(0)}
        className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/80 cursor-pointer active:scale-[0.98] transition-all hover:border-carbon-900 group relative overflow-hidden"
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

          <div className="w-9 h-9 rounded-full bg-carbon-900 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-coral-500 transition-colors shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Pierna (Sentadilla & Peso Muerto) */}
      <div
        onClick={() => onStartWorkout(1)}
        className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/80 cursor-pointer active:scale-[0.98] transition-all hover:border-carbon-900 group relative overflow-hidden"
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

          <div className="w-9 h-9 rounded-full bg-carbon-900 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-coral-500 transition-colors shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tarjeta Honor Choice Watch 2i compacta */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-200/60 flex items-center justify-between">
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
