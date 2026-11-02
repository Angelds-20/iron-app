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
  calculateEstimated1RM,
  compareWithPreviousSession,
  formatPreviousSessionSummary,
  calculateOverload
} from '../lib/overloadEngine'
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
  }, [selectedRoutineIndex, currentRoutine])

  useEffect(() => {
    if (initialRoutineIndex !== undefined && initialRoutineIndex !== selectedRoutineIndex) {
      const saved = getActiveSession() || activeSession
      if (!saved?.isActive) {
        handleSwitchRoutine(initialRoutineIndex)
      }
    }
  }, [initialRoutineIndex])

  // Helper para calibrar series según perfil del atleta (Angel: 194cm, 120kg, 60kg / 14kg)
  const buildInitialExerciseSets = (ex) => {
    const isHeavyBar =
      ex.id === 'bench-press' ||
      ex.id === 'incline-bench-press' ||
      ex.id === 'barbell-row' ||
      ex.id === 'back-squat' ||
      ex.id === 'deadlift' ||
      ex.id === 'calf-raises' ||
      ex.id === 'close-grip-bench'
    const rememberedWeight = lastWeights[ex.id] || ex.defaultWeight || (isHeavyBar ? 60 : 14)
    const targetSetsCount = ex.targetSets || 3
    const targetRirVal = ex.defaultRir !== undefined ? ex.defaultRir : 2

    return Array.from({ length: targetSetsCount }, (_, i) => {
      let repVal = 10
      if (ex.id === 'incline-bench-press') {
        repVal = i === 2 ? 6 : 10
      } else if (
        ex.id === 'french-press' ||
        ex.id === 'biceps-curl' ||
        ex.id === 'preacher-curl' ||
        ex.id === 'calf-raises'
      ) {
        repVal = 15
      } else if (ex.id === 'deadlift') {
        repVal = 8
      } else if (ex.targetReps) {
        const parsed = parseInt(ex.targetReps)
        if (!isNaN(parsed)) repVal = parsed
      }
      return {
        setNumber: i + 1,
        weight: rememberedWeight,
        reps: repVal,
        rir: targetRirVal,
        completed: false
      }
    })
  }

  // 2. Restaurar o inicializar series (CERO pérdida de peso ni de series)
  const [exerciseData, setExerciseData] = useState(() => {
    const saved = getActiveSession() || activeSession
    if (saved?.exerciseData && saved.routineIndex === selectedRoutineIndex) {
      return saved.exerciseData
    }
    const initial = {}
    currentRoutine.exercises.forEach((ex) => {
      initial[ex.id] = buildInitialExerciseSets(ex)
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

  // Manejador para cuando vuelves de background o bloqueas el iPhone
  useEffect(() => {
    const handleVisibilityChange = () => {
      setElapsedSeconds(Math.floor((Date.now() - workoutStartedAt) / 1000))

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

  // SINCRONIZACIÓN PERMANENTE: solo se activa como sesión en curso si el atleta completó al menos 1 serie
  useEffect(() => {
    if (onUpdateActiveSession) {
      const hasCompletedAnySet = Object.values(exerciseData).some((sets) =>
        sets.some((s) => s.completed)
      )
      if (hasCompletedAnySet) {
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
    if (!routines[idx]) return
    setSelectedRoutineIndex(idx)
    const newRoutine = routines[idx]
    const newExData = {}
    newRoutine.exercises.forEach((ex) => {
      newExData[ex.id] = buildInitialExerciseSets(ex)
    })
    setDynamicExercises(newRoutine.exercises)
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

      // Persistir peso inmediatamente
      if (field === 'weight' && Number(value) > 0) {
        saveLastUsedWeight(exerciseId, Number(value))
      }

      // Solo guardar en almacenamiento como sesión activa si hay al menos una serie completada
      const hasCompletedAny = Object.values(updated).some((sets) =>
        sets.some((s) => s.completed)
      )
      if (hasCompletedAny) {
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
      }

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

  const handleCycleRir = (exerciseId, setIdx) => {
    const currentRir = exerciseData[exerciseId]?.[setIdx]?.rir ?? 2
    // Ciclar entre 2 -> 1 -> 0 (Fallo) -> 3 -> 2
    const nextRir = currentRir === 2 ? 1 : currentRir === 1 ? 0 : currentRir === 0 ? 3 : 2
    handleUpdateSet(exerciseId, setIdx, 'rir', nextRir)
  }

  const handleToggleComplete = (exerciseId, setIdx) => {
    const isNowCompleted = !exerciseData[exerciseId][setIdx].completed
    handleUpdateSet(exerciseId, setIdx, 'completed', isNowCompleted)
    if (isNowCompleted) {
      const setWeight = exerciseData[exerciseId][setIdx].weight
      if (setWeight && Number(setWeight) > 0) {
        saveLastUsedWeight(exerciseId, Number(setWeight))
      }
      startRestTimer(currentRoutine?.restSeconds || 90)
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
    <div className="pb-36 animate-fadeIn">
      {/* Barra superior con volver, cronómetro real y selector de rutinas */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onCancel}
          className="w-11 h-11 rounded-full bg-[#212227] hover:bg-[#2C2D34] text-white flex items-center justify-center shadow-md touch-press flex-shrink-0 cursor-pointer"
          title="Guardar y volver a Workouts"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-1.5 bg-[#212227] p-1.5 rounded-full shadow-md">
          {routines.map((rot, idx) => (
            <button
              key={rot.id || idx}
              onClick={() => handleSwitchRoutine(idx)}
              className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap flex-shrink-0 cursor-pointer touch-press ${
                selectedRoutineIndex === idx
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#8E909A] hover:text-white'
              }`}
            >
              {rot.title.split('—')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Timer de descanso flotante dinámico con espacio para el notch */}
      {restSeconds > 0 && (
        <div className="fixed top-12 sm:top-14 left-4 right-4 z-50 max-w-md mx-auto bg-[#212227]/95 backdrop-blur-md text-white rounded-[24px] p-4 flex items-center justify-between shadow-2xl shadow-black/80 animate-slideDown">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2C2D34] flex items-center justify-center text-coral-500">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#8E909A] uppercase tracking-wider">
                DESCANSO EN VIVO
              </div>
              <div className="text-2xl font-black text-coral-500 font-mono tracking-tight leading-none">
                {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addRestTime(30)}
              className="text-xs font-black px-3.5 py-2 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white transition-colors touch-press cursor-pointer"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={cancelRestTimer}
              className="text-xs font-black px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors shadow-md touch-press cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {/* Encabezado con tiempo de entrenamiento real en vivo */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-lg mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">
              EN CURSO • TIEMPO ACTIVO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="meulify://"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C2D34] hover:bg-[#383A44] text-white text-xs font-bold transition-colors touch-press"
              title="Abrir reproductor Meulify en iPhone"
            >
              <Music className="w-3.5 h-3.5 text-coral-500" />
              <span>Meulify</span>
            </a>
            <div className="text-xs font-black font-mono text-white bg-[#2C2D34] px-3 py-1.5 rounded-full">
              {formatTime(elapsedSeconds)}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
          {currentRoutine.title}
        </h2>
        <p className="text-xs text-[#8E909A] leading-relaxed">{currentRoutine.description}</p>
      </div>

      {/* Lista de Ejercicios */}
      <div className="space-y-4">
        {dynamicExercises.map((exercise, exIndex) => {
          const sets = exerciseData[exercise.id] || []
          const lastPerformance = previousHistory?.[exercise.id]
          const comparison = compareWithPreviousSession(sets, lastPerformance)
          const overloadRec = calculateOverload(lastPerformance)
          const best1RM = sets.reduce((best, s) => {
            const r1m = calculateEstimated1RM(s.weight, s.reps)
            return r1m > best ? r1m : best
          }, 0)

          return (
            <div
              key={exercise.id}
              className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-lg space-y-4"
            >
              {/* Encabezado del ejercicio con botón de Sustitución y Badge de Progresión */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-full bg-[#2C2D34] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      {exIndex + 1}
                    </span>
                    <h3 className="text-lg font-extrabold text-white leading-snug">{exercise.name}</h3>
                    {comparison?.isProgressing && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-black tracking-wide uppercase border border-white/20">
                        <TrendingUp className="w-3 h-3 text-white" />
                        <span>PROGRESANDO {comparison.weightDiff > 0 ? `+${comparison.weightDiff}kg` : ''}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-[#8E909A] mt-1 ml-9">
                    {exercise.equipment}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSwapTargetExercise(exercise)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C2D34] hover:bg-[#383A44] text-white text-xs font-bold transition-colors flex-shrink-0 touch-press cursor-pointer"
                  title="Cambiar ejercicio (ej: predicador por curl)"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-coral-500" />
                  <span>Cambiar</span>
                </button>
              </div>

              {/* Historial Contextual en Vivo & Sugerencia de Sobrecarga */}
              {lastPerformance && (
                <div className="p-4 rounded-2xl bg-[#1A1B20] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-coral-500 flex-shrink-0" />
                      <span className="text-[10px] text-[#8E909A] font-extrabold uppercase tracking-wider">Último entreno:</span>
                      <span className="font-mono text-xs text-white font-black">
                        {formatPreviousSessionSummary(lastPerformance)}
                      </span>
                    </div>
                  </div>

                  {overloadRec && overloadRec.type !== 'baseline' && (
                    <div className="flex items-start gap-2 pt-2 text-xs text-zinc-300 leading-snug">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-white">Sugerencia hoy: </span>
                        <span>{overloadRec.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Guía rápida de tempo / notas */}
              <div className="text-xs text-[#8E909A] flex items-center gap-2 font-medium px-1">
                <TrendingUp className="w-3.5 h-3.5 text-coral-500 flex-shrink-0" />
                <span>{exercise.notes}</span>
              </div>

              {/* Series interactivas A PRUEBA DE GIMNASIO */}
              <div className="space-y-3">
                {sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`rounded-2xl p-3 sm:p-4 transition-all flex items-center justify-between gap-1.5 sm:gap-2 ${
                      set.completed
                        ? 'bg-white/10 ring-1 ring-white/30 text-white'
                        : 'bg-[#1A1B20]'
                    }`}
                  >
                    {/* Número de Serie */}
                    <span className="text-xs font-black text-[#565863] w-5 text-center flex-shrink-0">
                      #{set.setNumber}
                    </span>

                    {/* Stepper de Peso (Kilos) */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjustWeight(exercise.id, setIdx, -2.5)}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white flex items-center justify-center touch-press cursor-pointer flex-shrink-0 shadow-xs"
                        title="Restar 2.5 kg"
                      >
                        <Minus className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <div className="flex flex-col items-center justify-center min-w-[46px] sm:min-w-[54px]">
                        <span className="text-xl sm:text-2xl font-black font-mono text-white leading-none">
                          {set.weight}
                        </span>
                        <span className="text-[10px] font-normal text-[#8E909A] uppercase mt-0.5">kg</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdjustWeight(exercise.id, setIdx, 2.5)}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white flex items-center justify-center touch-press cursor-pointer flex-shrink-0 shadow-xs"
                        title="Sumar 2.5 kg"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Stepper de Repeticiones */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjustReps(exercise.id, setIdx, -1)}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white flex items-center justify-center touch-press cursor-pointer flex-shrink-0 shadow-xs"
                        title="Restar 1 rep"
                      >
                        <Minus className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <div className="flex flex-col items-center justify-center min-w-[34px] sm:min-w-[40px]">
                        <span className="text-xl sm:text-2xl font-black font-mono text-white leading-none">
                          {set.reps}
                        </span>
                        <span className="text-[10px] font-normal text-[#8E909A] uppercase mt-0.5">reps</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdjustReps(exercise.id, setIdx, 1)}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white flex items-center justify-center touch-press cursor-pointer flex-shrink-0 shadow-xs"
                        title="Sumar 1 rep"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Selector RIR interactivo táctil */}
                    <button
                      type="button"
                      onClick={() => handleCycleRir(exercise.id, setIdx)}
                      className={`h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer touch-press flex items-center justify-center ${
                        set.rir === 0
                          ? 'bg-rose-500/20 text-rose-400'
                          : set.rir === 1
                          ? 'bg-amber-500/20 text-amber-400'
                          : set.rir === 2
                          ? 'bg-[#2C2D34] text-white border border-white/20'
                          : 'bg-[#2C2D34] text-zinc-300'
                      }`}
                      title="Repeticiones en reserva (toca para cambiar)"
                    >
                      {set.rir === 0 ? 'Fallo' : `RIR ${set.rir ?? 2}`}
                    </button>

                    {/* Botón táctil grande de Check */}
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(exercise.id, setIdx)}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer touch-press flex-shrink-0 ${
                        set.completed
                          ? 'bg-white text-black shadow-lg shadow-white/30 scale-105'
                          : 'bg-[#2C2D34] hover:bg-[#383A44] text-[#565863] hover:text-white'
                      }`}
                      title={set.completed ? 'Serie completada' : 'Marcar serie como completada'}
                    >
                      <Check className={`w-5 h-5 stroke-[2.5] ${set.completed ? 'text-black' : 'text-zinc-400'}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pie de tarjeta con Añadir Serie y 1RM Estimado */}
              <div className="flex justify-between items-center px-1 pt-1">
                <button
                  type="button"
                  onClick={() => handleAddSet(exercise.id)}
                  className="flex items-center gap-1.5 text-xs font-black text-coral-500 hover:text-coral-400 cursor-pointer touch-press"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Añadir Serie</span>
                </button>

                {best1RM > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8E909A]">
                    <span className="text-[10px] uppercase tracking-wider text-[#565863]">1RM Estimado:</span>
                    <span className="font-mono font-black text-coral-500">{best1RM} kg</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Botón para añadir ejercicio extra improvisado a la sesión */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleAddNewExerciseToSession}
          className="w-full py-4 rounded-[24px] bg-[#212227] hover:bg-[#2C2D34] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg touch-press cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          <span>Añadir Otro Ejercicio a esta Sesión</span>
        </button>
      </div>

      {/* Botones de acción inferior */}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-sm rounded-[24px] shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-press"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Completar Entrenamiento de Hoy</span>
        </button>

        <button
          type="button"
          onClick={handleDiscardSession}
          className="w-full py-3 text-[#8E909A] hover:text-rose-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-press"
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
