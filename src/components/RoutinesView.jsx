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
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Encabezado de la Sección */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            PLANIFICACIÓN & SPLITS
          </span>
          <h2 className="text-xl font-black text-carbon-900 leading-tight">
            Gestor de Rutinas
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreateRoutine}
          className="px-3.5 py-2 bg-carbon-900 hover:bg-black text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-coral-500" />
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-carbon-900 text-white shadow-xs'
                  : 'bg-white text-neutral-500 hover:text-carbon-900 border border-sand-200/80'
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
              className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 hover:border-carbon-900 transition-all group"
            >
              {/* Cabecera de la tarjeta: Badge, Tiempo y Acciones Rápidas */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-[10px] font-black text-carbon-900 uppercase tracking-wider">
                    {getSplitLabel(routine.category)}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-coral-500" />
                    <span>{routine.estimatedTime || '40 min'}</span>
                  </span>
                  {routine.isCustom && (
                    <span className="text-[9px] font-extrabold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">
                      Personalizada
                    </span>
                  )}
                </div>

                {/* Acciones de gestión (Editar, Duplicar, Borrar) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onDuplicateRoutine(routine)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-carbon-900 hover:bg-sand-100 transition-colors cursor-pointer"
                    title="Duplicar rutina"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditRoutine(routine)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-carbon-900 hover:bg-sand-100 transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar rutina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Título y Descripción */}
              <h3 className="text-base font-black text-carbon-900 leading-tight">
                {routine.title}
              </h3>
              {routine.description && (
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {routine.description}
                </p>
              )}

              {/* Vista previa de ejercicios */}
              <div className="mt-3.5 pt-3 border-t border-sand-100 space-y-1.5">
                <div className="text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                  {exerciseCount} EJERCICIOS PROGRAMADOS
                </div>
                <div className="space-y-1">
                  {routine.exercises?.slice(0, 4).map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="flex items-center justify-between text-xs py-0.5"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-4 text-[10px] font-extrabold text-neutral-400">
                          {idx + 1}.
                        </span>
                        <span className="font-bold text-carbon-900 truncate">
                          {ex.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-neutral-500 flex-shrink-0">
                        {ex.targetSets} × {ex.targetReps} @ {ex.defaultWeight}kg
                      </span>
                    </div>
                  ))}
                  {exerciseCount > 4 && (
                    <div className="text-[10px] font-bold text-coral-500 pt-0.5">
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
                  className="w-full py-2.5 rounded-2xl bg-carbon-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
                  <span>Iniciar Este Entrenamiento</span>
                </button>
              </div>
            </div>
          )
        })}

        {filteredRoutines.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border border-sand-200">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-carbon-900">
              No hay rutinas en esta categoría
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Crea una rutina personalizada para este split y organízala a tu gusto.
            </p>
            <button
              type="button"
              onClick={onCreateRoutine}
              className="mt-4 px-4 py-2 bg-carbon-900 text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-coral-500" />
              <span>Crear Rutina Ahora</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
