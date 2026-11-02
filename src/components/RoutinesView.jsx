import React, { useState } from 'react'
import {
  Layers,
  Plus,
  Play,
  Edit3,
  Copy,
  Trash2,
  Clock,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { MUSCLE_SPLITS } from '../lib/constants'

export function RoutinesView({
  routines = [],
  onStartRoutine,
  onCreateRoutine,
  onEditRoutine,
  onDuplicateRoutine,
  onDeleteRoutine
}) {
  const [selectedSplit, setSelectedSplit] = useState('all')

  const filteredRoutines = routines.filter((r) => {
    if (selectedSplit === 'all') return true
    return r.category === selectedSplit
  })

  const getSplitLabel = (cat) => {
    switch (cat) {
      case 'torso':
        return 'Torso'
      case 'pierna':
        return 'Pierna'
      case 'push':
        return 'Empuje'
      case 'pull':
        return 'Tirón'
      case 'fullbody':
        return 'Fullbody'
      default:
        return 'General'
    }
  }

  return (
    <div className="space-y-4 pb-28 animate-fadeIn text-white">
      {/* Encabezado de la Sección */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            PLANIFICACIÓN & SPLITS
          </span>
          <h2 className="text-xl font-black text-white leading-tight">
            Gestor de Rutinas
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreateRoutine}
          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-2xl flex items-center gap-1.5 shadow-lg shadow-white/20 transition-transform active:scale-95 cursor-pointer touch-press"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>Nueva Rutina</span>
        </button>
      </div>

      {/* Selector de División / Filtro de Splits */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
        {MUSCLE_SPLITS.map((split) => {
          const isActive = selectedSplit === split.id
          return (
            <button
              key={split.id}
              onClick={() => setSelectedSplit(split.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer touch-press ${
                isActive
                  ? 'bg-white text-black shadow-md shadow-white/20'
                  : 'bg-[#212227] text-zinc-400 hover:text-white border border-[#2C2D34]'
              }`}
            >
              {split.label}
            </button>
          )
        })}
      </div>

      {/* Lista de Rutinas */}
      <div className="space-y-3.5">
        {filteredRoutines.map((routine) => {
          const originalIndex = routines.findIndex((r) => r.id === routine.id)
          const exerciseCount = routine.exercises?.length || 0

          return (
            <div
              key={routine.id}
              className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34]/50 hover:border-zinc-500 transition-all group"
            >
              {/* Cabecera de la tarjeta: Badge, Tiempo y Acciones Rápidas */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1A1B20] text-[10px] font-black text-white uppercase tracking-wider border border-[#2C2D34]">
                    {getSplitLabel(routine.category)}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{routine.estimatedTime || '40 min'}</span>
                  </span>
                  {routine.isCustom && (
                    <span className="text-[9px] font-black text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full">
                      Personalizada
                    </span>
                  )}
                </div>

                {/* Acciones de gestión (Editar, Duplicar, Borrar) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onDuplicateRoutine(routine)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#2C2D34] transition-colors cursor-pointer"
                    title="Duplicar rutina"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditRoutine(routine)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#2C2D34] transition-colors cursor-pointer"
                    title="Editar rutina"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {routine.isCustom && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar la rutina "${routine.title}"?`
                          )
                        ) {
                          onDeleteRoutine(routine.id)
                        }
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Eliminar rutina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Título y Descripción */}
              <h3 className="text-lg font-black text-white leading-tight">
                {routine.title}
              </h3>
              {routine.description && (
                <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                  {routine.description}
                </p>
              )}

              {/* Vista previa de ejercicios */}
              <div className="mt-4 pt-3.5 border-t border-[#2C2D34] space-y-2">
                <div className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
                  {exerciseCount} EJERCICIOS PROGRAMADOS
                </div>
                <div className="space-y-1.5">
                  {routine.exercises?.slice(0, 4).map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-[#1A1B20] border border-[#2C2D34]"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-4 text-[10px] font-black text-zinc-500">
                          {idx + 1}.
                        </span>
                        <span className="font-bold text-white truncate">
                          {ex.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-300 flex-shrink-0">
                        {ex.targetSets} × {ex.targetReps} @ {ex.defaultWeight}kg
                      </span>
                    </div>
                  ))}
                  {exerciseCount > 4 && (
                    <div className="text-[10px] font-bold text-zinc-400 pt-0.5 px-1">
                      +{exerciseCount - 4} ejercicios más...
                    </div>
                  )}
                </div>
              </div>

              {/* Botón principal: Iniciar Entreno */}
              <div className="mt-4 pt-1">
                <button
                  type="button"
                  onClick={() => onStartRoutine(originalIndex >= 0 ? originalIndex : 0)}
                  className="w-full py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-white/20 transition-transform active:scale-[0.98] cursor-pointer touch-press"
                >
                  <Play className="w-3.5 h-3.5 text-black fill-black" />
                  <span>Iniciar Este Entrenamiento</span>
                </button>
              </div>
            </div>
          )
        })}

        {filteredRoutines.length === 0 && (
          <div className="bg-[#212227] rounded-[28px] p-8 text-center border border-[#2C2D34]">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] text-zinc-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-white">
              No hay rutinas en esta categoría
            </h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
              Crea una rutina personalizada para este split y organízala a tu gusto.
            </p>
            <button
              type="button"
              onClick={onCreateRoutine}
              className="mt-4 px-4 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-2xl text-xs font-black inline-flex items-center gap-1.5 shadow-lg shadow-white/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
              <span>Crear Rutina Ahora</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
