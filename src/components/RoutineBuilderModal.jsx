import React, { useState } from 'react'
import { Plus, Trash2, X, Check, Dumbbell, Sparkles } from 'lucide-react'

export function RoutineBuilderModal({ isOpen, onClose, onSaveRoutine }) {
  const [routineTitle, setRoutineTitle] = useState('')
  const [category, setCategory] = useState('torso')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState([
    {
      id: 'ex-1',
      name: '',
      equipment: 'Barra / Mancuernas',
      targetSets: 4,
      targetReps: '8 - 10',
      defaultWeight: 40,
      notes: 'Control excéntrico de 2-3 segundos.'
    }
  ])

  if (!isOpen) return null

  const handleAddExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: `ex-${Date.now()}`,
        name: '',
        equipment: 'Barra / Mancuernas',
        targetSets: 3,
        targetReps: '10 - 12',
        defaultWeight: 20,
        notes: ''
      }
    ])
  }

  const handleUpdateExercise = (idx, field, value) => {
    setExercises((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  const handleRemoveExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!routineTitle.trim() || exercises.length === 0) return

    const validExercises = exercises.filter((ex) => ex.name.trim() !== '')
    if (validExercises.length === 0) return

    const newRoutine = {
      id: `custom-${Date.now()}`,
      title: routineTitle,
      category,
      estimatedTime: `${validExercises.length * 8} min`,
      intensity: 'Media',
      description: description || 'Rutina personalizada creada por el usuario.',
      exercises: validExercises
    }

    onSaveRoutine(newRoutine)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl p-6 max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-sand-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sand-100 flex items-center justify-center text-carbon-900">
              <Dumbbell className="w-4 h-4 text-coral-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-carbon-900">Crear Nueva Rutina</h3>
              <p className="text-[10px] text-neutral-400 font-semibold">Configura tus propios ejercicios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sand-100 text-neutral-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario scrolleable */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
              Nombre de la Rutina
            </label>
            <input
              type="text"
              placeholder="Ej: Empuje Pesado, Brazos & Hombro..."
              value={routineTitle}
              onChange={(e) => setRoutineTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-xs font-semibold text-carbon-900 border border-sand-200 outline-none cursor-pointer"
              >
                <option value="torso">Torso / Empuje</option>
                <option value="pierna">Pierna / Cadena posterior</option>
                <option value="fullbody">Full Body</option>
                <option value="brazos">Brazos / Aislado</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Nota corta
              </label>
              <input
                type="text"
                placeholder="Ej: Hipertrofia con RIR 2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-xs text-carbon-900 border border-sand-200 outline-none"
              />
            </div>
          </div>

          {/* Lista de Ejercicios */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Ejercicios ({exercises.length})
              </span>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="flex items-center gap-1 text-[11px] font-bold text-coral-500 hover:text-coral-600"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Ejercicio</span>
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200/80 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-neutral-400">
                      EJERCICIO #{idx + 1}
                    </span>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-neutral-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Nombre (ej: Press Militar con Barra)"
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase font-semibold">Series</span>
                      <input
                        type="number"
                        value={ex.targetSets}
                        onChange={(e) => handleUpdateExercise(idx, 'targetSets', Number(e.target.value))}
                        className="w-full text-center py-1 bg-white rounded-lg text-xs font-bold border border-sand-200 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase font-semibold">Reps</span>
                      <input
                        type="text"
                        value={ex.targetReps}
                        onChange={(e) => handleUpdateExercise(idx, 'targetReps', e.target.value)}
                        className="w-full text-center py-1 bg-white rounded-lg text-xs font-bold border border-sand-200 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase font-semibold">Peso Base (kg)</span>
                      <input
                        type="number"
                        value={ex.defaultWeight}
                        onChange={(e) => handleUpdateExercise(idx, 'defaultWeight', Number(e.target.value))}
                        className="w-full text-center py-1 bg-white rounded-lg text-xs font-bold border border-sand-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4 text-coral-500" />
              <span>Guardar y Comenzar Rutina</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
