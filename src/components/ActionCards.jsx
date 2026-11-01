import React from 'react'
import { Dumbbell, ArrowRight, Activity, Watch, Shield } from 'lucide-react'
import { APP_IMAGES } from '../lib/constants'

export function ActionCards({ onStartWorkout, onOpenWatchModal, lastWatchData }) {
  return (
    <div className="grid grid-cols-1 gap-3 mb-6">
      {/* Tarjeta Principal de Entrenamiento */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 relative overflow-hidden group">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 mb-3 border border-sand-200/50">
              <Dumbbell className="w-5 h-5 text-coral-500" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              SESIÓN DE PATIO
            </span>
            <h3 className="text-xl font-extrabold text-carbon-900 tracking-tight mt-0.5">
              Entrenamiento de Hoy
            </h3>
            <p className="text-xs text-neutral-500 font-medium mt-1 max-w-[240px]">
              Press de banca, sentadillas y peso muerto con tus 60 kg.
            </p>
          </div>

          <button
            onClick={onStartWorkout}
            className="self-center px-6 py-3.5 bg-carbon-900 hover:bg-black text-white rounded-full text-xs font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-md flex items-center gap-2"
          >
            <span>Start</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Imagen de fondo sutil con opacidad refinada */}
        <div className="absolute -right-4 -bottom-6 w-32 h-32 rounded-full overflow-hidden opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity">
          <img
            src={APP_IMAGES.workoutCard}
            alt="Workout background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Tarjeta de Honor Choice Watch 2i */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-sand-100 text-carbon-900 flex items-center justify-center border border-sand-200/50">
            <Watch className="w-5 h-5 text-coral-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-carbon-900">Honor Choice Watch 2i</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {lastWatchData?.avgBpm
                ? `${lastWatchData.avgBpm} BPM prom • ${lastWatchData.caloriesBurned} kcal quemadas`
                : 'Sincronizado vía Apple Health / Honor Health'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenWatchModal}
          className="text-xs font-bold text-coral-500 hover:text-coral-600 px-3 py-1.5 rounded-full bg-coral-50 border border-coral-100 transition-colors"
        >
          Métricas
        </button>
      </div>
    </div>
  )
}
