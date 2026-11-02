import React, { useState, useEffect, useRef } from 'react'
import {
  Check,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  Clock,
  Dumbbell,
  ArrowLeft,
  Sparkles,
  Watch,
  RotateCcw,
  Volume2,
  RefreshCw,
  Music
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { DEFAULT_ROUTINES } from '../lib/constants'
import { initAudio, playTimerDoneSound } from '../lib/soundEngine'
import { ExerciseSwapModal } from './ExerciseSwapModal'
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getLastUsedWeights,
  saveLastUsedWeight
} from '../lib/workoutStorage'

export function WorkoutLogger({
  routines = DEFAULT_ROUTINES,
  initialRoutineIndex = 0,
  activeSession = null,
  onUpdateActiveSession,
  onClearActiveSession,
  onCompleteWorkout,
  onCancel,
  previousHistory = {}
}) {
  // 1. Restaurar o inicializar índice de rutina (Directo de storage)
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState(() => {
    const saved = getActiveSession() || activeSession
    if (saved && saved.routineIndex !== undefined) {
      return saved.routineIndex
    }
    return initialRoutineIndex
  })

  const currentRoutine = routines[selectedRoutineIndex] || routines[0] || DEFAULT_ROUTINES[0]
  const lastWeights = getLastUsedWeights()

  // Ejercicios modificables en vivo durante la sesión (ej: Predicador en vez de Curl)
  const [dynamicExercises, setDynamicExercises] = useState(() => currentRoutine.exercises)
  const [swapTargetExercise, setSwapTargetExercise] = useState(null)

  useEffect(() => {
    setDynamicExercises(currentRoutine.exercises)
  }, [selectedRoutineIndex])

  // 2. Restaurar o inicializar series (CERO pérdida de peso ni de series)
  const [exerciseData, setExerciseData] = useState(() => {
    const saved = getActiveSession() || activeSession
    if (saved?.exerciseData && saved.routineIndex === selectedRoutineIndex) {
      return saved.exerciseData
    }
    const initial = {}
    currentRoutine.exercises.forEach((ex) => {
      const rememberedWeight = lastWeights[ex.id] || ex.defaultWeight || (ex.id === 'bench-press' ? 60 : 40)
      initial[ex.id] = [
        { setNumber: 1, weight: rememberedWeight, reps: 10, rir: 2, completed: false },
        { setNumber: 2, weight: rememberedWeight, reps: 10, rir: 2, completed: false },
        { setNumber: 3, weight: rememberedWeight, reps: 10, rir: 2, completed: false }
      ]
    })
    return initial
  })

  // 3. Tiempo de inicio de entrenamiento persistente
  const [workoutStartedAt] = useState(() => {
    const saved = getActiveSession() || activeSession
    return saved?.startedAt || Date.now()
  })

  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const saved = getActiveSession() || activeSession
    return Math.floor((Date.now() - (saved?.startedAt || Date.now())) / 1000)
  })

  // 4. Timer de descanso entre series (Basado en timestamp para sobrevivir a TikTok / background)
  const [restEndsAt, setRestEndsAt] = useState(() => {
    const saved = getActiveSession() || activeSession
    return saved?.restEndsAt || null
  })

  const [restSeconds, setRestSeconds] = useState(() => {
    const saved = getActiveSession() || activeSession
    if (saved?.restEndsAt) {
      return Math.max(0, Math.ceil((saved.restEndsAt - Date.now()) / 1000))
    }
    return 0
  })

  const soundPlayedRef = useRef(false)

  // 5. Métricas de Honor Choice Watch 2i
  const [watchBpm, setWatchBpm] = useState(() => {
    const saved = getActiveSession() || activeSession
    return saved?.watchBpm || 132
  })

  const [watchCalories, setWatchCalories] = useState(() => {
    const saved = getActiveSession() || activeSession
    return saved?.watchCalories || 240
  })

  // Manejador para cuando vuelves de TikTok o bloqueas el iPhone (visibilitychange)
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Recalcular tiempo de entrenamiento real
      setElapsedSeconds(Math.floor((Date.now() - workoutStartedAt) / 1000))

      // Recalcular tiempo de descanso
      if (restEndsAt) {
        const remaining = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000))
        setRestSeconds(remaining)
        if (remaining === 0 && !soundPlayedRef.current) {
          soundPlayedRef.current = true
          playTimerDoneSound()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [workoutStartedAt, restEndsAt])

  // Contador de tiempo transcurrido continuo
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - workoutStartedAt) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [workoutStartedAt])

  // Timer de descanso basado en timestamp
  useEffect(() => {
    if (!restEndsAt) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000))
      setRestSeconds(remaining)

      if (remaining === 0) {
        if (!soundPlayedRef.current) {
          soundPlayedRef.current = true
          playTimerDoneSound()
        }
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [restEndsAt])

  // SINCRONIZACIÓN PERMANENTE INMEDIATA: cada cambio se guarda en localStorage
  useEffect(() => {
    if (onUpdateActiveSession) {
      onUpdateActiveSession({
        isActive: true,
        routineIndex: selectedRoutineIndex,
        routineId: currentRoutine.id,
        startedAt: workoutStartedAt,
        restEndsAt,
        exerciseData,
        watchBpm,
        watchCalories
      })
    }
  }, [exerciseData, selectedRoutineIndex, watchBpm, watchCalories, workoutStartedAt, restEndsAt])

  const startRestTimer = (seconds = 90) => {
    initAudio()
    const ends = Date.now() + seconds * 1000
    soundPlayedRef.current = false
    setRestEndsAt(ends)
    setRestSeconds(seconds)
  }

  const cancelRestTimer = () => {
    setRestEndsAt(null)
    setRestSeconds(0)
    soundPlayedRef.current = true
  }

  const addRestTime = (secondsToAdd = 30) => {
    initAudio()
    soundPlayedRef.current = false
    const currentBase = restEndsAt && restEndsAt > Date.now() ? restEndsAt : Date.now()
    const nextEnds = currentBase + secondsToAdd * 1000
    setRestEndsAt(nextEnds)
    setRestSeconds(Math.max(0, Math.ceil((nextEnds - Date.now()) / 1000)))
  }

  const handleSwitchRoutine = (idx) => {
    setSelectedRoutineIndex(idx)
    const newRoutine = routines[idx]
    const newExData = {}
    newRoutine.exercises.forEach((ex) => {
      newExData[ex.id] = [
        { setNumber: 1, weight: ex.defaultWeight || 45, reps: 10, rir: 2, completed: false },
        { setNumber: 2, weight: ex.defaultWeight || 45, reps: 10, rir: 2, completed: false },
        { setNumber: 3, weight: ex.defaultWeight || 45, reps: 10, rir: 2, completed: false }
      ]
    })
    setExerciseData(newExData)
  }

  const handleUpdateSet = (exerciseId, setIdx, field, value) => {
    setExerciseData((prev) => {
      const currentSets = [...(prev[exerciseId] || [])]
      currentSets[setIdx] = {
        ...currentSets[setIdx],
        [field]: value
      }
      const updated = { ...prev, [exerciseId]: currentSets }

      // Persistir peso inmediatamente para que nunca más se resetee
      if (field === 'weight' && Number(value) > 0) {
        saveLastUsedWeight(exerciseId, Number(value))
      }

      saveActiveSession({
        isActive: true,
        routineIndex: selectedRoutineIndex,
        routineId: currentRoutine.id,
        startedAt: workoutStartedAt,
        restEndsAt,
        exerciseData: updated,
        watchBpm,
        watchCalories
      })

      return updated
    })
  }

  const handleQuickAdjustWeight = (exerciseId, setIdx, delta) => {
    const current = Number(exerciseData[exerciseId][setIdx].weight) || 0
    const nextVal = Math.max(0, current + delta)
    handleUpdateSet(exerciseId, setIdx, 'weight', nextVal)
  }

  const handleQuickAdjustReps = (exerciseId, setIdx, delta) => {
    const current = Number(exerciseData[exerciseId][setIdx].reps) || 0
    const nextVal = Math.max(1, current + delta)
    handleUpdateSet(exerciseId, setIdx, 'reps', nextVal)
  }

  const handleToggleComplete = (exerciseId, setIdx) => {
    const isNowCompleted = !exerciseData[exerciseId][setIdx].completed
    handleUpdateSet(exerciseId, setIdx, 'completed', isNowCompleted)
    if (isNowCompleted) {
      const setWeight = exerciseData[exerciseId][setIdx].weight
      if (setWeight && Number(setWeight) > 0) {
        saveLastUsedWeight(exerciseId, Number(setWeight))
      }
      startRestTimer(90)
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

  const handleConfirmSwap = ({ oldExerciseId, newName, applyPermanently }) => {
    setDynamicExercises((prev) =>
      prev.map((ex) => (ex.id === oldExerciseId ? { ...ex, name: newName } : ex))
    )
    const currentWeight = exerciseData[oldExerciseId]?.[0]?.weight || 40
    saveLastUsedWeight(oldExerciseId, currentWeight)
  }

  const handleAddNewExerciseToSession = () => {
    const newId = `session-ex-${Date.now()}`
    const newEx = {
      id: newId,
      name: 'Ejercicio Extra',
      equipment: 'Patio / Barra',
      targetSets: 3,
      targetReps: '10',
      defaultWeight: 20,
      notes: 'Tempo 3 seg excéntrico.'
    }
    setDynamicExercises((prev) => [...prev, newEx])
    setExerciseData((prev) => ({
      ...prev,
      [newId]: [
        { setNumber: 1, weight: 20, reps: 10, rir: 2, completed: false },
        { setNumber: 2, weight: 20, reps: 10, rir: 2, completed: false },
        { setNumber: 3, weight: 20, reps: 10, rir: 2, completed: false }
      ]
    }))
  }

  const handleDiscardSession = () => {
    if (window.confirm('¿Seguro que quieres descartar esta sesión? Se reseteará el progreso actual.')) {
      clearActiveSession()
      if (onClearActiveSession) {
        onClearActiveSession()
      }
      onCancel()
    }
  }

  const handleFinish = () => {
    let totalVolume = 0
    let maxWeight = 0
    let completedSetsCount = 0

    const formattedExercises = dynamicExercises.map((ex) => {
      const sets = exerciseData[ex.id] || []
      sets.forEach((s) => {
        if (s.completed) {
          const w = Number(s.weight) || 0
          const r = Number(s.reps) || 0
          totalVolume += w * r
          if (w > maxWeight) maxWeight = w
          completedSetsCount += 1
          // Guardar el peso alcanzado
          saveLastUsedWeight(ex.id, w)
        }
      })
      return {
        id: ex.id,
        name: ex.name,
        sets
      }
    })

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Limpiar sesión activa en progreso
    clearActiveSession()
    if (onClearActiveSession) {
      onClearActiveSession()
    }

    onCompleteWorkout({
      routineId: currentRoutine.id,
      title: currentRoutine.title,
      category: currentRoutine.category,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      completedAt: new Date().toISOString(),
      totalVolume,
      maxWeight,
      completedSetsCount,
      watchMetrics: {
        avgBpm: Number(watchBpm),
        caloriesBurned: Number(watchCalories)
      },
      exercises: formattedExercises
    })
  }

  // Formato mm:ss o hh:mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    if (mins >= 60) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return `${h}h ${m}m ${s < 10 ? '0' : ''}${s}s`
    }
    return `${mins}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="pb-36">
      {/* Barra superior con volver, cronómetro real y selector de rutinas */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onCancel}
          className="p-2.5 rounded-full bg-white border border-sand-200 text-carbon-800 hover:bg-sand-100 transition-colors shadow-xs flex-shrink-0"
          title="Guardar y volver al inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-full border border-sand-200/80 w-full shadow-xs">
          {routines.slice(0, 2).map((rot, idx) => (
            <button
              key={rot.id}
              onClick={() => handleSwitchRoutine(idx)}
              className={`py-2 text-xs font-bold rounded-full transition-all ${
                selectedRoutineIndex === idx
                  ? 'bg-carbon-900 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-carbon-900'
              }`}
            >
              {rot.category === 'torso' ? 'Torso (Banca)' : 'Pierna (Sentadilla)'}
            </button>
          ))}
        </div>
      </div>

      {/* Timer de descanso flotante inteligente */}
      {restSeconds > 0 && (
        <div className="sticky top-2 z-30 mb-4 bg-carbon-900 text-white rounded-2xl p-3 flex items-center justify-between shadow-lg shadow-carbon-900/15 border border-carbon-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-coral-500 animate-spin" />
            <span className="text-xs font-bold">Descanso:</span>
            <span className="text-lg font-black text-coral-500 font-mono tracking-tight">
              {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addRestTime(30)}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-carbon-800 hover:bg-carbon-700 text-neutral-300"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={cancelRestTimer}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sand-100 text-carbon-900"
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {/* Encabezado con tiempo de entrenamiento real en vivo */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/60 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              EN CURSO • TIEMPO ACTIVO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="meulify://"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-carbon-900 text-[11px] font-bold border border-sand-200/80 transition-colors"
              title="Abrir reproductor Meulify en iPhone"
            >
              <Music className="w-3 h-3 text-coral-500" />
              <span>Meulify</span>
            </a>
            <div className="text-xs font-black font-mono text-carbon-900 bg-sand-100 px-2.5 py-1 rounded-full">
              {formatTime(elapsedSeconds)}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-carbon-900 tracking-tight mt-1.5">
          {currentRoutine.title}
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">{currentRoutine.description}</p>
      </div>

      {/* Lista de Ejercicios */}
      <div className="space-y-4">
        {dynamicExercises.map((exercise, exIndex) => {
          const sets = exerciseData[exercise.id] || []

          return (
            <div
              key={exercise.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/60"
            >
              {/* Encabezado del ejercicio con botón de Sustitución */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sand-100 text-carbon-900 text-xs font-bold flex items-center justify-center">
                      {exIndex + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-carbon-900">{exercise.name}</h3>
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-400 mt-0.5 ml-8">
                    {exercise.equipment}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSwapTargetExercise(exercise)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-neutral-600 text-[11px] font-bold border border-sand-200/80 transition-colors"
                  title="Cambiar ejercicio (ej: predicador por curl)"
                >
                  <RefreshCw className="w-3 h-3 text-coral-500" />
                  <span>Cambiar</span>
                </button>
              </div>

              {/* Guía rápida de tempo / RIR */}
              <div className="ml-8 mb-3 text-[11px] text-neutral-500 flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-coral-500 flex-shrink-0" />
                <span>{exercise.notes}</span>
              </div>

              {/* Series interactivas */}
              <div className="space-y-2.5">
                {sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      set.completed
                        ? 'bg-emerald-50/70 border border-emerald-200/80 text-emerald-900'
                        : 'bg-sand-50/80 border border-sand-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-neutral-400 w-6">
                        #{set.setNumber}
                      </span>

                      {/* Ajuste Rápido de Kilos */}
                      <div className="flex items-center bg-white rounded-xl border border-sand-200 shadow-2xs px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustWeight(exercise.id, setIdx, -2.5)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-carbon-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-12 text-center text-xs font-black text-carbon-900 font-mono">
                          {set.weight} kg
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustWeight(exercise.id, setIdx, 2.5)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-carbon-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Ajuste Rápido de Repeticiones */}
                      <div className="flex items-center bg-white rounded-xl border border-sand-200 shadow-2xs px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustReps(exercise.id, setIdx, -1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-carbon-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-carbon-900 font-mono">
                          {set.reps}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustReps(exercise.id, setIdx, 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-carbon-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Botón táctil grande de Check */}
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(exercise.id, setIdx)}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                        set.completed
                          ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20'
                          : 'bg-white border border-sand-200 text-neutral-300 hover:text-carbon-900'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Botón añadir serie rápido */}
              <div className="mt-3 ml-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleAddSet(exercise.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-coral-500 hover:text-coral-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Serie</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Botón para añadir ejercicio extra improvisado a la sesión */}
      <div className="mt-3">
        <button
          type="button"
          onClick={handleAddNewExerciseToSession}
          className="w-full py-3.5 rounded-3xl bg-white hover:bg-sand-50 border border-dashed border-sand-300 text-neutral-600 hover:text-carbon-900 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <Plus className="w-4 h-4 text-coral-500" />
          <span>Añadir Otro Ejercicio a esta Sesión</span>
        </button>
      </div>

      {/* Botones de acción inferior */}
      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-4 bg-carbon-900 hover:bg-black active:scale-[0.99] text-white font-extrabold text-sm rounded-full shadow-lg shadow-carbon-900/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-coral-500" />
          <span>Completar Entrenamiento de Hoy</span>
        </button>

        <button
          type="button"
          onClick={handleDiscardSession}
          className="w-full py-2.5 text-neutral-400 hover:text-rose-500 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Descartar progreso de esta sesión</span>
        </button>
      </div>

      {/* Modal para sustituir ejercicio (ej: Curl por Predicador) */}
      <ExerciseSwapModal
        isOpen={Boolean(swapTargetExercise)}
        exercise={swapTargetExercise}
        onClose={() => setSwapTargetExercise(null)}
        onConfirmSwap={handleConfirmSwap}
      />
    </div>
  )
}
