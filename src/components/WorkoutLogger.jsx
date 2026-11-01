import React, { useState } from 'react'
import {
  Check,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  Dumbbell,
  ArrowLeft,
  Sparkles,
  Info,
  ChevronDown,
  RotateCcw
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { DEFAULT_ROUTINES } from '../lib/constants'
import { calculateOverload } from '../lib/overloadEngine'

export function WorkoutLogger({ onCompleteWorkout, onCancel, previousHistory = {} }) {
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState(0)
  const currentRoutine = DEFAULT_ROUTINES[selectedRoutineIndex]

  // Estado de las series por ejercicio
  const [exerciseData, setExerciseData] = useState(() => {
    const initial = {}
    currentRoutine.exercises.forEach((ex) => {
      initial[ex.id] = [
        { setNumber: 1, weight: ex.defaultWeight, reps: 10, rir: 2, completed: false },
        { setNumber: 2, weight: ex.defaultWeight, reps: 10, rir: 2, completed: false },
        { setNumber: 3, weight: ex.defaultWeight, reps: 10, rir: 2, completed: false }
      ]
    })
    return initial
  })

  // Timer de descanso entre series
  const [restSeconds, setRestSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  React.useEffect(() => {
    let interval = null
    if (timerActive && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((sec) => sec - 1)
      }, 1000)
    } else if (restSeconds === 0) {
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, restSeconds])

  const startRestTimer = (seconds = 90) => {
    setRestSeconds(seconds)
    setTimerActive(true)
  }

  const handleUpdateSet = (exerciseId, setIdx, field, value) => {
    setExerciseData((prev) => {
      const currentSets = [...prev[exerciseId]]
      currentSets[setIdx] = {
        ...currentSets[setIdx],
        [field]: value
      }
      return { ...prev, [exerciseId]: currentSets }
    })
  }

  const handleToggleComplete = (exerciseId, setIdx) => {
    const isNowCompleted = !exerciseData[exerciseId][setIdx].completed
    handleUpdateSet(exerciseId, setIdx, 'completed', isNowCompleted)
    if (isNowCompleted) {
      startRestTimer(90) // Inicia 90 segundos de descanso automáticamente
    }
  }

  const handleAddSet = (exerciseId) => {
    setExerciseData((prev) => {
      const currentSets = prev[exerciseId] || []
      const lastSet = currentSets[currentSets.length - 1] || { weight: 40, reps: 10, rir: 2 }
      const newSet = {
        setNumber: currentSets.length + 1,
        weight: lastSet.weight,
        reps: lastSet.reps,
        rir: lastSet.rir,
        completed: false
      }
      return { ...prev, [exerciseId]: [...currentSets, newSet] }
    })
  }

  const handleRemoveSet = (exerciseId, setIdx) => {
    setExerciseData((prev) => {
      const currentSets = prev[exerciseId].filter((_, idx) => idx !== setIdx)
      const renumbered = currentSets.map((s, idx) => ({ ...s, setNumber: idx + 1 }))
      return { ...prev, [exerciseId]: renumbered }
    })
  }

  const handleFinish = () => {
    // Calcular estadísticas del entreno
    let totalVolume = 0
    let maxWeight = 0
    let completedSetsCount = 0

    const formattedExercises = currentRoutine.exercises.map((ex) => {
      const sets = exerciseData[ex.id] || []
      sets.forEach((s) => {
        if (s.completed) {
          const w = Number(s.weight) || 0
          const r = Number(s.reps) || 0
          totalVolume += w * r
          if (w > maxWeight) maxWeight = w
          completedSetsCount += 1
        }
      })
      return {
        id: ex.id,
        name: ex.name,
        sets
      }
    })

    // Efecto de celebración con confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })

    onCompleteWorkout({
      routineId: currentRoutine.id,
      title: currentRoutine.title,
      category: currentRoutine.category,
      completedAt: new Date().toISOString(),
      totalVolume,
      maxWeight,
      completedSetsCount,
      exercises: formattedExercises
    })
  }

  return (
    <div className="pb-32">
      {/* Barra superior con volver y selector de rutina */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onCancel}
          className="p-2.5 rounded-full bg-white border border-sand-200 text-carbon-800 hover:bg-sand-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <select
            value={selectedRoutineIndex}
            onChange={(e) => {
              const idx = Number(e.target.value)
              setSelectedRoutineIndex(idx)
              const newExData = {}
              DEFAULT_ROUTINES[idx].exercises.forEach((ex) => {
                newExData[ex.id] = [
                  { setNumber: 1, weight: ex.defaultWeight, reps: 10, rir: 2, completed: false },
                  { setNumber: 2, weight: ex.defaultWeight, reps: 10, rir: 2, completed: false },
                  { setNumber: 3, weight: ex.defaultWeight, reps: 10, rir: 2, completed: false }
                ]
              })
              setExerciseData(newExData)
            }}
            className="bg-white border border-sand-200 text-xs font-bold text-carbon-900 rounded-full px-3 py-2 outline-none shadow-sm cursor-pointer"
          >
            {DEFAULT_ROUTINES.map((rot, i) => (
              <option key={rot.id} value={i}>
                {rot.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timer de descanso flotante o banner superior si está activo */}
      {restSeconds > 0 && (
        <div className="mb-4 bg-carbon-900 text-white rounded-2xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-coral-500 animate-spin" />
            <span className="text-xs font-semibold">Descanso entre series:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-coral-500 font-mono">
              {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}
            </span>
            <button
              onClick={() => setRestSeconds(0)}
              className="text-[11px] underline text-neutral-400 hover:text-white"
            >
              Saltar
            </button>
          </div>
        </div>
      )}

      {/* Resumen de la rutina actual */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 mb-5 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-block px-2.5 py-1 rounded-full bg-sand-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider mb-2">
              Sesión Activa
            </div>
            <h2 className="text-xl font-extrabold text-carbon-900 tracking-tight">
              {currentRoutine.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">{currentRoutine.description}</p>
          </div>
        </div>
      </div>

      {/* Lista de Ejercicios */}
      <div className="space-y-4">
        {currentRoutine.exercises.map((exercise, exIndex) => {
          const sets = exerciseData[exercise.id] || []
          const overloadAdvice = calculateOverload(previousHistory[exercise.id])

          return (
            <div
              key={exercise.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60"
            >
              {/* Encabezado del ejercicio */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand-100 text-carbon-800 text-[11px] font-bold flex items-center justify-center">
                      {exIndex + 1}
                    </span>
                    <h3 className="text-base font-bold text-carbon-900">{exercise.name}</h3>
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-400 mt-0.5 ml-7">
                    {exercise.equipment} • {exercise.targetSets} series × {exercise.targetReps} reps
                  </div>
                </div>
              </div>

              {/* Guía de Sobrecarga Progresiva */}
              <div className="ml-7 my-3 p-3 bg-sand-50 rounded-2xl border border-sand-200/50 flex items-start gap-2.5 text-xs">
                <TrendingUp className="w-4 h-4 text-coral-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-carbon-900 text-[11px]">
                    Objetivo de Sobrecarga:
                  </div>
                  <div className="text-neutral-500 text-[11px] mt-0.5">
                    {exercise.notes}
                  </div>
                </div>
              </div>

              {/* Encabezados de tabla de series */}
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2 text-center">
                <span className="col-span-2 text-left">Serie</span>
                <span className="col-span-4">Kilos (kg)</span>
                <span className="col-span-3">Reps</span>
                <span className="col-span-2">RIR</span>
                <span className="col-span-1">OK</span>
              </div>

              {/* Filas de series */}
              <div className="space-y-2">
                {sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`grid grid-cols-12 gap-2 items-center p-2 rounded-2xl transition-colors ${
                      set.completed
                        ? 'bg-sand-100/70 border border-sand-200/70'
                        : 'bg-sand-50/50 hover:bg-sand-50'
                    }`}
                  >
                    <span className="col-span-2 text-xs font-bold text-neutral-400 pl-1">
                      #{set.setNumber}
                    </span>

                    {/* Input Kilos */}
                    <div className="col-span-4">
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight}
                        onChange={(e) =>
                          handleUpdateSet(exercise.id, setIdx, 'weight', e.target.value)
                        }
                        className="w-full text-center py-1.5 bg-white font-bold text-carbon-900 text-sm rounded-xl border border-sand-200 outline-none focus:border-coral-500 transition-colors"
                      />
                    </div>

                    {/* Input Reps */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleUpdateSet(exercise.id, setIdx, 'reps', e.target.value)
                        }
                        className="w-full text-center py-1.5 bg-white font-bold text-carbon-900 text-sm rounded-xl border border-sand-200 outline-none focus:border-coral-500 transition-colors"
                      />
                    </div>

                    {/* Selector RIR */}
                    <div className="col-span-2">
                      <select
                        value={set.rir}
                        onChange={(e) =>
                          handleUpdateSet(exercise.id, setIdx, 'rir', Number(e.target.value))
                        }
                        className="w-full text-center py-1.5 bg-white font-semibold text-neutral-600 text-xs rounded-xl border border-sand-200 outline-none cursor-pointer"
                        title="Repeticiones en reserva antes del fallo"
                      >
                        <option value={0}>0 (Fallo)</option>
                        <option value={1}>1 rep</option>
                        <option value={2}>2 reps</option>
                        <option value={3}>3+ reps</option>
                      </select>
                    </div>

                    {/* Botón check de completado */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleToggleComplete(exercise.id, setIdx)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          set.completed
                            ? 'bg-coral-500 text-white shadow-sm'
                            : 'bg-sand-200 text-neutral-400 hover:bg-sand-300 hover:text-carbon-900'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón añadir serie */}
              <div className="mt-3 flex justify-between items-center px-1">
                <button
                  onClick={() => handleAddSet(exercise.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-carbon-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-coral-500" />
                  <span>Añadir Serie</span>
                </button>

                {sets.length > 1 && (
                  <button
                    onClick={() => handleRemoveSet(exercise.id, sets.length - 1)}
                    className="text-[11px] text-neutral-400 hover:text-rose-500 transition-colors"
                  >
                    Quitar última
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Botón final flotante para registrar entreno */}
      <div className="mt-6">
        <button
          onClick={handleFinish}
          className="w-full py-4 bg-carbon-900 hover:bg-black active:scale-[0.99] text-white font-extrabold text-sm rounded-full shadow-lg shadow-carbon-900/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-coral-500" />
          <span>Completar Entrenamiento de Hoy</span>
        </button>
      </div>
    </div>
  )
}
