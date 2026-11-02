import React, { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Trash2,
  Check,
  ArrowUp,
  ArrowDown,
  Dumbbell,
  Layers,
  Search,
  BookOpen,
  Edit3
} from 'lucide-react'
import { EXERCISES_CATALOG, MUSCLE_SPLITS } from '../lib/constants'

export function RoutineEditorModal({
  isOpen,
  onClose,
  onSaveRoutine,
  routineToEdit = null
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('torso')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState([])
  const [showCatalogPicker, setShowCatalogPicker] = useState(false)
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogMuscleFilter, setCatalogMuscleFilter] = useState('all')

  useEffect(() => {
    if (routineToEdit) {
      setTitle(routineToEdit.title || '')
      setCategory(routineToEdit.category || 'torso')
      setDescription(routineToEdit.description || '')
      setExercises(
        routineToEdit.exercises && routineToEdit.exercises.length > 0
          ? routineToEdit.exercises.map((ex) => ({ ...ex }))
          : []
      )
    } else {
      setTitle('')
      setCategory('torso')
      setDescription('')
      // Default con 1 ejercicio base
      setExercises([
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          equipment: 'Barra principal (60 kg) + Banco',
          defaultWeight: 60,
          targetSets: 4,
          targetReps: '8 - 10',
          defaultRir: 2,
          notes: 'Pausa de 1 segundo en el pecho. Escápulas retraídas.'
        }
      ])
    }
    setShowCatalogPicker(false)
    setCatalogSearch('')
  }, [routineToEdit, isOpen])

  if (!isOpen) return null

  // Reordenar ejercicios
  const handleMoveExercise = (idx, direction) => {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= exercises.length) return
    const updated = [...exercises]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    setExercises(updated)
  }

  // Modificar campo de ejercicio
  const handleUpdateExercise = (idx, field, value) => {
    setExercises((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  // Eliminar ejercicio
  const handleRemoveExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx))
  }

  // Agregar ejercicio desde el catálogo
  const handleAddCatalogExercise = (catalogItem) => {
    const newEx = {
      id: `${catalogItem.id}-${Date.now()}`,
      name: catalogItem.name,
      equipment: catalogItem.equipment || 'Patio / Barra',
      defaultWeight: catalogItem.defaultWeight || 20,
      targetSets: catalogItem.targetSets || 3,
      targetReps: catalogItem.targetReps || '10',
      defaultRir: catalogItem.defaultRir !== undefined ? catalogItem.defaultRir : 2,
      notes: catalogItem.notes || ''
    }
    setExercises((prev) => [...prev, newEx])
    setShowCatalogPicker(false)
  }

  // Agregar ejercicio libre personalizado
  const handleAddCustomExercise = () => {
    const newEx = {
      id: `custom-ex-${Date.now()}`,
      name: '',
      equipment: 'Barra / Mancuernas',
      defaultWeight: 20,
      targetSets: 3,
      targetReps: '10',
      defaultRir: 2,
      notes: ''
    }
    setExercises((prev) => [...prev, newEx])
  }

  // Guardar rutina
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const validExercises = exercises.filter((ex) => ex.name.trim() !== '')
    if (validExercises.length === 0) return

    const estimatedMinutes = Math.max(20, validExercises.length * 8)

    const routineData = {
      id: routineToEdit?.id || `routine-custom-${Date.now()}`,
      title: title.trim(),
      category,
      estimatedTime: `${estimatedMinutes} min`,
      intensity: 'Alta',
      description: description.trim() || 'Rutina personalizada para sobrecarga en patio.',
      exercises: validExercises,
      isCustom: true,
      updatedAt: new Date().toISOString()
    }

    onSaveRoutine(routineData)
    onClose()
  }

  // Filtrado del catálogo
  const filteredCatalog = EXERCISES_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.equipment.toLowerCase().includes(catalogSearch.toLowerCase())
    const matchesMuscle =
      catalogMuscleFilter === 'all' || item.category === catalogMuscleFilter
    return matchesSearch && matchesMuscle
  })

  const muscleCategories = [
    { id: 'all', label: 'Todos' },
    { id: 'pecho', label: 'Pecho' },
    { id: 'espalda', label: 'Espalda' },
    { id: 'pierna', label: 'Pierna' },
    { id: 'hombros', label: 'Hombros' },
    { id: 'biceps', label: 'Bíceps' },
    { id: 'triceps', label: 'Tríceps' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-white">
      <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#2C2D34]">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2C2D34]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">
                {routineToEdit ? 'Editar Rutina' : 'Nueva Rutina'}
              </h3>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Estructura tus ejercicios, series y cargas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#2C2D34] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar py-3.5 space-y-4">
          {/* Título de la Rutina */}
          <div>
            <label className="block text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-1">
              Nombre de la Rutina
            </label>
            <input
              type="text"
              placeholder="Ej: Empuje Pesado, Torso Fuerza, Brazos & Hombro..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-bold text-white border border-[#2C2D34] outline-none focus:border-white transition-colors"
              required
            />
          </div>

          {/* División Muscular & Descripción */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-1">
                División / Split
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-bold text-white border border-[#2C2D34] outline-none cursor-pointer"
              >
                <option value="torso">Torso</option>
                <option value="pierna">Pierna</option>
                <option value="push">Empuje (Push)</option>
                <option value="pull">Tirón (Pull)</option>
                <option value="fullbody">Fullbody</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-1">
                Objetivo / Nota
              </label>
              <input
                type="text"
                placeholder="Ej: Foco RIR 2, banco 60kg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-medium text-white border border-[#2C2D34] outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Lista de Ejercicios */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                Ejercicios Planificados ({exercises.length})
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowCatalogPicker(true)}
                  className="px-2.5 py-1 rounded-full bg-[#1A1B20] hover:bg-[#2C2D34] text-white text-[10px] font-bold flex items-center gap-1 border border-[#2C2D34] transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-white" />
                  <span>Catálogo</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomExercise}
                  className="px-2.5 py-1 rounded-full bg-white text-black hover:bg-zinc-200 text-[10px] font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-black stroke-[3]" />
                  <span>Manual</span>
                </button>
              </div>
            </div>

            {/* Selector desplegable de catálogo */}
            {showCatalogPicker && (
              <div className="mb-3.5 p-3.5 bg-[#141518] rounded-2xl border border-[#2C2D34] space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-white uppercase">
                    Elegir del Catálogo
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCatalogPicker(false)}
                    className="text-zinc-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Búsqueda */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar ejercicio o equipamiento..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#1A1B20] rounded-xl text-xs text-white border border-[#2C2D34] outline-none focus:border-white"
                  />
                </div>

                {/* Filtro por grupo muscular */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {muscleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCatalogMuscleFilter(cat.id)}
                      className={`px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        catalogMuscleFilter === cat.id
                          ? 'bg-white text-black font-black'
                          : 'bg-[#1A1B20] text-zinc-400 hover:text-white border border-[#2C2D34]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Lista de ejercicios del catálogo */}
                <div className="max-h-48 overflow-y-auto no-scrollbar space-y-1.5 pt-1">
                  {filteredCatalog.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddCatalogExercise(item)}
                      className="w-full text-left p-2 bg-[#1A1B20] hover:bg-[#22242B] rounded-xl border border-[#2C2D34] flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-zinc-200">
                          {item.name}
                        </div>
                        <div className="text-[9px] text-zinc-400 font-medium">
                          {item.equipment} • {item.defaultWeight} kg base
                        </div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                    </button>
                  ))}
                  {filteredCatalog.length === 0 && (
                    <div className="text-center py-3 text-[10px] text-zinc-400 font-medium">
                      No se encontraron ejercicios con ese criterio.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tarjetas de ejercicios de la rutina */}
            <div className="space-y-2.5">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] space-y-2 relative"
                >
                  {/* Encabezado del Ejercicio: Número, Reordenar y Borrar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        ORDEN
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Subir */}
                      <button
                        type="button"
                        onClick={() => handleMoveExercise(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded-lg bg-[#2C2D34] text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Subir de posición"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      {/* Bajar */}
                      <button
                        type="button"
                        onClick={() => handleMoveExercise(idx, 1)}
                        disabled={idx === exercises.length - 1}
                        className="p-1 rounded-lg bg-[#2C2D34] text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Bajar de posición"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      {/* Eliminar */}
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(idx)}
                          className="p-1 rounded-lg bg-[#2C2D34] text-zinc-400 hover:text-rose-400 ml-1 transition-colors cursor-pointer"
                          title="Eliminar ejercicio"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Nombre del Ejercicio */}
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre del ejercicio..."
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(idx, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#141518] rounded-xl text-xs font-bold text-white border border-[#2C2D34] outline-none focus:border-white"
                      required
                    />
                  </div>

                  {/* Equipamiento */}
                  <div>
                    <input
                      type="text"
                      placeholder="Equipamiento (ej: Barra 60kg, Barra chica...)"
                      value={ex.equipment || ''}
                      onChange={(e) => handleUpdateExercise(idx, 'equipment', e.target.value)}
                      className="w-full px-2.5 py-1 bg-[#141518] rounded-lg text-[10px] text-zinc-400 border border-[#2C2D34] outline-none"
                    />
                  </div>

                  {/* Métricas: Series, Reps, Peso Base, RIR */}
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div>
                      <span className="text-[8px] font-black text-zinc-400 uppercase">Series</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ex.targetSets || 3}
                        onChange={(e) =>
                          handleUpdateExercise(idx, 'targetSets', Number(e.target.value))
                        }
                        className="w-full text-center py-1 bg-[#141518] rounded-lg text-xs font-black text-white border border-[#2C2D34] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-zinc-400 uppercase">Reps</span>
                      <input
                        type="text"
                        value={ex.targetReps || '10'}
                        onChange={(e) => handleUpdateExercise(idx, 'targetReps', e.target.value)}
                        className="w-full text-center py-1 bg-[#141518] rounded-lg text-xs font-bold text-white border border-[#2C2D34] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-zinc-400 uppercase">Peso (kg)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={ex.defaultWeight || 0}
                        onChange={(e) =>
                          handleUpdateExercise(idx, 'defaultWeight', Number(e.target.value))
                        }
                        className="w-full text-center py-1 bg-[#141518] rounded-lg text-xs font-black text-white border border-[#2C2D34] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-zinc-400 uppercase">RIR Obj</span>
                      <select
                        value={ex.defaultRir !== undefined ? ex.defaultRir : 2}
                        onChange={(e) =>
                          handleUpdateExercise(idx, 'defaultRir', Number(e.target.value))
                        }
                        className="w-full text-center py-1 bg-[#141518] rounded-lg text-[11px] font-black text-white border border-[#2C2D34] outline-none cursor-pointer"
                      >
                        <option value={3}>RIR 3</option>
                        <option value={2}>RIR 2</option>
                        <option value={1}>RIR 1</option>
                        <option value={0}>Fallo (0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-[20px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/20 cursor-pointer touch-press"
            >
              <Check className="w-4 h-4 text-black stroke-[3]" />
              <span>{routineToEdit ? 'Actualizar Rutina' : 'Guardar y Activar Rutina'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
