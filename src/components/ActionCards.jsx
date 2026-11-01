import React from 'react'
import { Dumbbell, Utensils, Play, Plus, ArrowRight } from 'lucide-react'
import { APP_IMAGES } from '../lib/constants'

export function ActionCards({ onStartWorkout, onLogMeals }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Tarjeta Workouts */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 mb-3 border border-sand-200/50">
            <Dumbbell className="w-4 h-4 text-coral-500" />
          </div>
          <h3 className="text-lg font-bold text-carbon-900 tracking-tight">Workouts</h3>
          <p className="text-xs text-neutral-400 font-medium mt-0.5 mb-4">
            Track and improve
          </p>
        </div>

        <button
          onClick={onStartWorkout}
          className="relative z-10 w-full py-2.5 px-4 bg-carbon-900 hover:bg-black text-white rounded-full text-xs font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Start</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Imagen de fondo sutil con opacidad refinada */}
        <div className="absolute -right-3 -bottom-3 w-24 h-24 rounded-full overflow-hidden opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity">
          <img
            src={APP_IMAGES.workoutCard}
            alt="Workout background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Tarjeta Meals */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 mb-3 border border-sand-200/50">
            <Utensils className="w-4 h-4 text-carbon-800" />
          </div>
          <h3 className="text-lg font-bold text-carbon-900 tracking-tight">Meals</h3>
          <p className="text-xs text-neutral-400 font-medium mt-0.5 mb-4">
            Log and track nutrition
          </p>
        </div>

        <button
          onClick={onLogMeals}
          className="relative z-10 w-full py-2.5 px-4 bg-carbon-900 hover:bg-black text-white rounded-full text-xs font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Log</span>
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Imagen de fondo sutil con opacidad refinada */}
        <div className="absolute -right-3 -bottom-3 w-24 h-24 rounded-full overflow-hidden opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity">
          <img
            src={APP_IMAGES.mealsCard}
            alt="Meals background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
