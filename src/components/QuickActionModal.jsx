import React from 'react'
import {
  X,
  Play,
  Utensils,
  Scale,
  PlusCircle,
  Sliders,
  UserCheck,
  Dumbbell
} from 'lucide-react'

export function QuickActionModal({
  isOpen,
  onClose,
  onStartWorkout,
  onOpenNutrition,
  onOpenWeightModal,
  onCreateRoutine,
  onOpenSettings,
  athleteProfile = { name: 'Angel', weight: 120.0, height: 194 }
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#212227] rounded-t-[32px] sm:rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-[#2C2D34] relative animate-slideUp text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C2D34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs">
              <Dumbbell className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                ACCESO RÁPIDO
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                Acciones de Angel
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#1A1B20] hover:bg-[#2C2D34] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de Acciones Rápidas */}
        <div className="space-y-2 py-4">
          {/* 1. Iniciar Entrenamiento */}
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onStartWorkout) onStartWorkout(0)
            }}
            className="w-full p-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black flex items-center justify-between shadow-lg shadow-white/10 transition-transform active:scale-[0.98] cursor-pointer touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">
                  Iniciar Entrenamiento
                </span>
                <span className="text-[10px] font-medium text-zinc-700 block mt-0.5">
                  Rutina programada de hoy
                </span>
              </div>
            </div>
            <span className="text-xs font-black">→</span>
          </button>

          {/* 2. Registrar Comida */}
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onOpenNutrition) onOpenNutrition()
            }}
            className="w-full p-3.5 rounded-2xl bg-[#1A1B20] hover:bg-[#2C2D34] text-white flex items-center justify-between border border-[#2C2D34] transition-transform active:scale-[0.98] cursor-pointer touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2C2D34] text-white flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">
                  Registrar Comida & Macros
                </span>
                <span className="text-[10px] font-medium text-zinc-400 block mt-0.5">
                  16 bloques típicos chilenos con 1 toque
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-zinc-500">→</span>
          </button>

          {/* 3. Registrar Peso Corporal */}
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onOpenWeightModal) onOpenWeightModal()
            }}
            className="w-full p-3.5 rounded-2xl bg-[#1A1B20] hover:bg-[#2C2D34] text-white flex items-center justify-between border border-[#2C2D34] transition-transform active:scale-[0.98] cursor-pointer touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2C2D34] text-white flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">
                  Actualizar Peso Corporal
                </span>
                <span className="text-[10px] font-medium text-zinc-400 block mt-0.5">
                  Actual: {athleteProfile.weight || 120.0} kg
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-zinc-500">→</span>
          </button>

          {/* 4. Crear Nueva Rutina */}
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onCreateRoutine) onCreateRoutine()
            }}
            className="w-full p-3.5 rounded-2xl bg-[#1A1B20] hover:bg-[#2C2D34] text-white flex items-center justify-between border border-[#2C2D34] transition-transform active:scale-[0.98] cursor-pointer touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2C2D34] text-white flex items-center justify-center">
                <PlusCircle className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">
                  Crear Nueva Rutina
                </span>
                <span className="text-[10px] font-medium text-zinc-400 block mt-0.5">
                  Personalizar ejercicios, series y descansos
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-zinc-500">→</span>
          </button>

          {/* 5. Ajustes del Atleta & Equipamiento */}
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onOpenSettings) onOpenSettings()
            }}
            className="w-full p-3.5 rounded-2xl bg-[#1A1B20] hover:bg-[#2C2D34] text-white flex items-center justify-between border border-[#2C2D34] transition-transform active:scale-[0.98] cursor-pointer touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2C2D34] text-white flex items-center justify-center">
                <Sliders className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">
                  Perfil de Atleta & Gimnasio
                </span>
                <span className="text-[10px] font-medium text-zinc-400 block mt-0.5">
                  Barras (60kg / 14kg), descansos y medidas
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-zinc-500">→</span>
          </button>
        </div>

        {/* Tarjeta Informativa de Atleta Único */}
        <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] flex items-center gap-2.5">
          <UserCheck className="w-4 h-4 text-white flex-shrink-0" />
          <p className="text-[10px] text-zinc-400 leading-tight">
            <strong className="text-white">Modo Personal Activado:</strong>{' '}
            Tus datos se guardan directo en tu iPhone. Sin correos ni contraseñas.
          </p>
        </div>
      </div>
    </div>
  )
}
