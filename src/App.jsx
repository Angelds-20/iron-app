import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Trophy } from 'lucide-react'
import { Header } from './components/Header'
import { WeekStrip } from './components/WeekStrip'
import { BodyweightCard } from './components/BodyweightCard'
import { SessionMetricsCard } from './components/SessionMetricsCard'
import { ActionCards } from './components/ActionCards'
import { Navbar } from './components/Navbar'
import { WorkoutLogger } from './components/WorkoutLogger'
import { RoutinesView } from './components/RoutinesView'
import { RoutineEditorModal } from './components/RoutineEditorModal'
import { StatsView } from './components/StatsView'
import { BodyMeasurementsModal } from './components/BodyMeasurementsModal'
import { WatchView } from './components/WatchView'
import { SettingsView } from './components/SettingsView'
import { WatchModal } from './components/WatchModal'
import { AuthModal } from './components/AuthModal'
import { GlobalRestTimer } from './components/GlobalRestTimer'
import { evaluateAchievements } from './lib/overloadEngine'
import { BADGES_CATALOG, DEFAULT_ROUTINES, APP_VERSION } from './lib/constants'
import { getRealisticProgressionSeed } from './lib/statsEngine'
import { getRealisticBodyMeasurementsSeed } from './lib/bodyMetricsEngine'
import { syncWorkoutToCloud } from './lib/syncService'
import { getInitialSession, signOutUser } from './lib/authService'
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession
} from './lib/workoutStorage'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [activeRoutineIndex, setActiveRoutineIndex] = useState(0)
  const [statsSubTab, setStatsSubTab] = useState('strength')
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isRoutineEditorOpen, setIsRoutineEditorOpen] = useState(false)
  const [isBodyModalOpen, setIsBodyModalOpen] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState(null)
  const [userSession, setUserSession] = useState(null)

  // Medidas antropométricas y evolución corporal (Local-First)
  const [bodyMeasurements, setBodyMeasurements] = useState(() => {
    const saved = localStorage.getItem('iron_body_measurements_v1')
    if (saved) {
      try {
        const list = JSON.parse(saved)
        if (list.length > 0) return list
      } catch (e) {}
    }
    const seeded = getRealisticBodyMeasurementsSeed()
    localStorage.setItem('iron_body_measurements_v1', JSON.stringify(seeded))
    return seeded
  })

  // Cargar sesión de usuario permanente (Supabase Auth)
  useEffect(() => {
    getInitialSession().then((session) => {
      if (session) setUserSession(session)
    })
  }, [])

  // Auto-scroll al inicio en cada cambio de pestaña (mejora UX móvil)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeTab])

  // Sincronización automática vía Atajos de Apple (iOS Shortcuts Deep Link)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('watchSync') === '1' || params.has('avgBpm') || params.has('bpm')) {
      const avg = Number(params.get('avgBpm') || params.get('bpm'))
      const max = Number(params.get('maxBpm') || params.get('max'))
      const cal = Number(params.get('cal') || params.get('calories') || params.get('kcal'))

      if (avg > 0 || cal > 0) {
        const syncedData = {
          avgBpm: avg || 132,
          maxBpm: max || (avg ? avg + 28 : 165),
          caloriesBurned: cal || 260,
          updatedAt: new Date().toISOString()
        }
        setWatchData(syncedData)
        localStorage.setItem('honor_watch_data', JSON.stringify(syncedData))

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 }
        })

        setActiveTab('watch')

        const cleanUrl = window.location.pathname + window.location.hash
        window.history.replaceState({}, document.title, cleanUrl)
      }
    }
  }, [])

  // Sesión en curso persistente (auto-descarta si tiene más de 3 horas para evitar sesiones fantasma)
  const [activeWorkoutSession, setActiveWorkoutSession] = useState(() => {
    const saved = getActiveSession()
    if (saved?.startedAt && Date.now() - saved.startedAt > 3 * 60 * 60 * 1000) {
      clearActiveSession()
      try {
        localStorage.removeItem('active_workout_session')
      } catch (e) {}
      return null
    }
    return saved
  })

  const handleUpdateActiveSession = (sessionData) => {
    setActiveWorkoutSession(sessionData)
    saveActiveSession(sessionData)
  }

  const handleClearActiveSession = () => {
    setActiveWorkoutSession(null)
    clearActiveSession()
    try {
      localStorage.removeItem('active_workout_session')
    } catch (e) {}
  }

  // Rutinas activas (predefinidas + creadas por el usuario)
  const [allRoutines, setAllRoutines] = useState(() => {
    const saved = localStorage.getItem('user_custom_routines')
    if (saved) {
      try {
        const custom = JSON.parse(saved)
        return [...DEFAULT_ROUTINES, ...custom]
      } catch (e) {
        return DEFAULT_ROUTINES
      }
    }
    return DEFAULT_ROUTINES
  })

  // Peso Corporal
  const [bodyweight, setBodyweight] = useState(() => {
    return Number(localStorage.getItem('user_weight')) || 77.9
  })

  // Días completados (Garantiza hoy por la sesión de 60 kg)
  const [completedDates, setCompletedDates] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem('completed_workout_dates')
    const list = saved ? JSON.parse(saved) : []
    return list.includes(todayStr) ? list : [...list, todayStr]
  })

  // Días de descanso planificados
  const [restDates, setRestDates] = useState(() => {
    const saved = localStorage.getItem('iron_rest_dates_v2')
    return saved ? JSON.parse(saved) : []
  })

  // Entrenamientos completados (Historial con sobrecarga progresiva y 60 kg garantizados)
  const [workoutsHistory, setWorkoutsHistory] = useState(() => {
    const saved = localStorage.getItem('workouts_history')
    const list = saved ? JSON.parse(saved) : []
    if (list.length <= 1 || !list.some((w) => w.maxWeight >= 60)) {
      const seeded = getRealisticProgressionSeed()
      localStorage.setItem('workouts_history', JSON.stringify(seeded))
      return seeded
    }
    return list
  })

  // Insignias y logros desbloqueados
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const earnedCodes = ['FIRST_SESSION', 'BENCH_50KG', 'MAX_WEIGHT_60KG', 'VOLUME_2000KG']
    const autoBadges = BADGES_CATALOG.filter((b) => earnedCodes.includes(b.code))
    const saved = localStorage.getItem('unlocked_badges')
    if (saved) {
      try {
        const list = JSON.parse(saved)
        const codes = new Set(list.map((b) => b.code))
        const merged = [...list]
        autoBadges.forEach((b) => {
          if (!codes.has(b.code)) merged.push(b)
        })
        return merged
      } catch (e) {
        return autoBadges
      }
    }
    return autoBadges
  })

  // Experiencia total (XP)
  const [totalXp, setTotalXp] = useState(() => {
    const saved = Number(localStorage.getItem('total_xp'))
    return saved > 800 ? saved : 850
  })

  // Récords personales (PRs con 60 kg en banca blindados)
  const [personalRecords, setPersonalRecords] = useState(() => {
    const saved = localStorage.getItem('personal_records')
    if (saved) {
      try {
        const prs = JSON.parse(saved)
        return {
          ...prs,
          benchPress: Math.max(60, prs.benchPress || 60)
        }
      } catch (e) {}
    }
    return { benchPress: 60, squat: 50, deadlift: 60 }
  })

  // Métricas de Honor Choice Watch 2i
  const [watchData, setWatchData] = useState(() => {
    const saved = localStorage.getItem('honor_watch_data')
    return saved ? JSON.parse(saved) : { avgBpm: 132, maxBpm: 165, caloriesBurned: 260 }
  })

  // Modal de nueva insignia desbloqueada
  const [newBadgeModal, setNewBadgeModal] = useState(null)

  // Temporizador flotante de descanso (sobrevive si el usuario va a Home)
  const [globalRestSeconds, setGlobalRestSeconds] = useState(0)

  useEffect(() => {
    if (!activeWorkoutSession?.restEndsAt) {
      setGlobalRestSeconds(0)
      return
    }
    const update = () => {
      const remaining = Math.max(0, Math.ceil((activeWorkoutSession.restEndsAt - Date.now()) / 1000))
      setGlobalRestSeconds(remaining)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [activeWorkoutSession?.restEndsAt])

  // Persistencia Local reactiva
  useEffect(() => {
    localStorage.setItem('user_weight', bodyweight.toString())
  }, [bodyweight])

  useEffect(() => {
    localStorage.setItem('completed_workout_dates', JSON.stringify(completedDates))
  }, [completedDates])

  useEffect(() => {
    localStorage.setItem('iron_rest_dates_v2', JSON.stringify(restDates))
  }, [restDates])

  useEffect(() => {
    localStorage.setItem('workouts_history', JSON.stringify(workoutsHistory))
  }, [workoutsHistory])

  useEffect(() => {
    localStorage.setItem('unlocked_badges', JSON.stringify(unlockedBadges))
  }, [unlockedBadges])

  useEffect(() => {
    localStorage.setItem('total_xp', totalXp.toString())
  }, [totalXp])

  useEffect(() => {
    localStorage.setItem('personal_records', JSON.stringify(personalRecords))
  }, [personalRecords])

  useEffect(() => {
    localStorage.setItem('honor_watch_data', JSON.stringify(watchData))
  }, [watchData])

  const handleSaveRoutine = (routineData) => {
    setAllRoutines((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === routineData.id)
      let updated
      if (existingIdx >= 0) {
        updated = [...prev]
        updated[existingIdx] = routineData
      } else {
        updated = [...prev, routineData]
      }
      const customOnly = updated.filter((r) => r.isCustom)
      localStorage.setItem('user_custom_routines', JSON.stringify(customOnly))
      return updated
    })
  }

  const handleDeleteRoutine = (routineId) => {
    setAllRoutines((prev) => {
      const updated = prev.filter((r) => r.id !== routineId)
      const customOnly = updated.filter((r) => r.isCustom)
      localStorage.setItem('user_custom_routines', JSON.stringify(customOnly))
      return updated
    })
  }

  const handleDuplicateRoutine = (routine) => {
    const duplicated = {
      ...routine,
      id: `routine-custom-${Date.now()}`,
      title: `${routine.title} (Copia)`,
      isCustom: true,
      updatedAt: new Date().toISOString()
    }
    handleSaveRoutine(duplicated)
  }

  const handleOpenCreateRoutine = () => {
    setEditingRoutine(null)
    setIsRoutineEditorOpen(true)
  }

  const handleOpenEditRoutine = (routine) => {
    setEditingRoutine(routine)
    setIsRoutineEditorOpen(true)
  }

  const handleSaveMeasurement = (entry) => {
    setBodyMeasurements((prev) => {
      const updated = [entry, ...prev]
      localStorage.setItem('iron_body_measurements_v1', JSON.stringify(updated))
      return updated
    })
    if (entry.weight && Number(entry.weight) > 0) {
      setBodyweight(Number(entry.weight))
      localStorage.setItem('user_weight', entry.weight.toString())
    }
  }

  const handleDeleteMeasurement = (id) => {
    setBodyMeasurements((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      localStorage.setItem('iron_body_measurements_v1', JSON.stringify(updated))
      return updated
    })
  }

  // Marcar día de descanso (+50 XP y racha protegida)
  const handleLogRestDay = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    if (!restDates.includes(todayStr) && !completedDates.includes(todayStr)) {
      setRestDates((prev) => [...prev, todayStr])
      setTotalXp((prev) => prev + 50)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      })
    }
  }

  // Construir mapa de historial contextual por ejercicio (última sesión ejecutada)
  const previousExerciseHistory = React.useMemo(() => {
    const map = {}
    workoutsHistory.forEach((workout) => {
      workout.exercises?.forEach((ex) => {
        if (!map[ex.id] && ex.sets && ex.sets.length > 0) {
          map[ex.id] = {
            sets: ex.sets,
            completedAt: workout.completedAt,
            routineTitle: workout.title
          }
        }
      })
    })

    // Garantizar que Press de Banca tenga su registro contextual base (60 kg)
    if (!map['bench-press']) {
      map['bench-press'] = {
        sets: [
          { setNumber: 1, weight: 60, reps: 10, rir: 2, completed: true },
          { setNumber: 2, weight: 60, reps: 10, rir: 2, completed: true },
          { setNumber: 3, weight: 60, reps: 9, rir: 1, completed: true },
          { setNumber: 4, weight: 60, reps: 8, rir: 0, completed: true }
        ],
        completedAt: new Date().toISOString(),
        routineTitle: 'Torso — Banca & Inclinado'
      }
    }
    return map
  }, [workoutsHistory])

  // Volumen de la última sesión
  const lastWorkout = workoutsHistory[0]
  const currentSessionVolume = lastWorkout?.totalVolume || 0

  // Restablecer volumen a la sesión real de hoy (2.400 kg en banca de 60 kg)
  const handleResetVolumeToReal = () => {
    const cleanSession = {
      routineId: 'torso-fuerza',
      title: 'Torso — Banca & Inclinado',
      category: 'torso',
      durationMinutes: 40,
      completedAt: new Date().toISOString(),
      totalVolume: 2400,
      maxWeight: 60,
      completedSetsCount: 4,
      watchMetrics: { avgBpm: 132, caloriesBurned: 260 },
      exercises: [
        {
          id: 'bench-press',
          name: 'Press de banca plano',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, completed: true },
            { setNumber: 2, weight: 60, reps: 10, completed: true },
            { setNumber: 3, weight: 60, reps: 10, completed: true },
            { setNumber: 4, weight: 60, reps: 10, completed: true }
          ]
        }
      ]
    }
    setWorkoutsHistory([cleanSession])
    localStorage.setItem('workouts_history', JSON.stringify([cleanSession]))
    handleClearActiveSession()
  }

  // Finalizar entrenamiento
  const handleCompleteWorkout = (workoutData) => {
    const todayStr = new Date().toISOString().split('T')[0]

    if (!completedDates.includes(todayStr)) {
      setCompletedDates((prev) => [...prev, todayStr])
    }

    if (workoutData.watchMetrics) {
      setWatchData(workoutData.watchMetrics)
    }

    const newHistory = [workoutData, ...workoutsHistory]
    setWorkoutsHistory(newHistory)

    // Sincronizar en la nube con Supabase
    syncWorkoutToCloud(workoutData, { weight: bodyweight }).catch((err) =>
      console.warn('Sync cloud warning:', err)
    )

    if (workoutData.maxWeight > (personalRecords.benchPress || 0)) {
      setPersonalRecords((prev) => ({
        ...prev,
        benchPress: workoutData.maxWeight
      }))
    }

    const newBadges = evaluateAchievements(unlockedBadges, workoutData, newHistory)
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges])
      const xpGained = newBadges.reduce((acc, b) => acc + (b.xpReward || 50), 0) + 120
      setTotalXp((prev) => prev + xpGained)
      setNewBadgeModal(newBadges[0])
    } else {
      setTotalXp((prev) => prev + 120)
    }

    handleClearActiveSession()
    setActiveTab('home')
  }

  const handleSignOut = async () => {
    await signOutUser()
    setUserSession(null)
  }

  return (
    <div className="min-h-screen bg-sand-100 flex justify-center selection:bg-coral-500 selection:text-white">
      {/* Contenedor optimizado para iPhone 13 (notch 47px, barra inferior 34px) */}
      <div className="w-full max-w-md px-5 pt-3 pb-28 relative min-h-screen">
        {/* Vistas según la pestaña activa */}
        {activeTab === 'home' && (
          <div>
            <Header
              title="Home"
              streak={Math.max(1, completedDates.length + restDates.length)}
              onOpenCalendar={() => setActiveTab('workout')}
              userSession={userSession}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />

            {/* Strip de la semana con días circulares y descanso activo */}
            <WeekStrip
              completedDates={completedDates}
              restDates={restDates}
              activeDate={new Date()}
              onLogRestDay={handleLogRestDay}
            />

            {/* Tarjeta de Peso Corporal */}
            <BodyweightCard
              weight={bodyweight}
              onUpdateWeight={setBodyweight}
              onOpenEvolution={() => {
                setStatsSubTab('body')
                setActiveTab('stats')
              }}
            />

            {/* Métricas de Fuerza & Honor Choice Watch 2i */}
            <SessionMetricsCard
              totalVolume={currentSessionVolume}
              targetVolume={2500}
              avgBpm={watchData.avgBpm}
              maxBpm={watchData.maxBpm}
              activeCalories={watchData.caloriesBurned}
            />

            {/* Tarjetas de Acción de Entrenamiento y Reloj */}
            <ActionCards
              onStartWorkout={(idx = 0) => {
                setActiveRoutineIndex(idx)
                setActiveTab('workout')
              }}
              onOpenWatchModal={() => setActiveTab('watch')}
              lastWatchData={watchData}
              activeSession={activeWorkoutSession}
              onDiscardActiveSession={handleClearActiveSession}
              routines={allRoutines}
              onViewAllRoutines={() => setActiveTab('routines')}
            />
          </div>
        )}

        {/* Gestor y Constructor de Rutinas */}
        {activeTab === 'routines' && (
          <div>
            <Header
              title="Rutinas"
              streak={Math.max(1, completedDates.length + restDates.length)}
              userSession={userSession}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
            <RoutinesView
              routines={allRoutines}
              onStartRoutine={(idx) => {
                setActiveRoutineIndex(idx)
                setActiveTab('workout')
              }}
              onCreateRoutine={handleOpenCreateRoutine}
              onEditRoutine={handleOpenEditRoutine}
              onDuplicateRoutine={handleDuplicateRoutine}
              onDeleteRoutine={handleDeleteRoutine}
            />
          </div>
        )}

        {activeTab === 'workout' && (
          <WorkoutLogger
            routines={allRoutines}
            initialRoutineIndex={activeRoutineIndex}
            activeSession={activeWorkoutSession}
            onUpdateActiveSession={handleUpdateActiveSession}
            onClearActiveSession={handleClearActiveSession}
            onAddNewRoutine={handleSaveRoutine}
            onCompleteWorkout={handleCompleteWorkout}
            onCancel={() => setActiveTab('home')}
            previousHistory={previousExerciseHistory}
          />
        )}

        {/* Módulo de Estadísticas & Curvas de Sobrecarga */}
        {activeTab === 'stats' && (
          <div>
            <Header
              title="Progreso"
              streak={Math.max(1, completedDates.length + restDates.length)}
              userSession={userSession}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
            <StatsView
              workoutsHistory={workoutsHistory}
              personalRecords={personalRecords}
              watchData={watchData}
              onOpenWatchSync={() => setActiveTab('watch')}
              bodyMeasurements={bodyMeasurements}
              onOpenAddMeasurement={() => setIsBodyModalOpen(true)}
              onDeleteMeasurement={handleDeleteMeasurement}
              activeSubTab={statsSubTab}
              onSelectSubTab={setStatsSubTab}
            />
          </div>
        )}

        {activeTab === 'watch' && (
          <div>
            <Header
              title="Honor Watch"
              streak={Math.max(1, completedDates.length + restDates.length)}
              userSession={userSession}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
            <WatchView
              currentData={watchData}
              onSaveData={(newData) => setWatchData(newData)}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <Header
              title="Ajustes"
              streak={Math.max(1, completedDates.length + restDates.length)}
              userSession={userSession}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
            <SettingsView
              userProfile={{ weight: bodyweight }}
              onUpdateProfile={() => {}}
              onResetVolume={handleResetVolumeToReal}
              onClearSession={handleClearActiveSession}
            />
          </div>
        )}

        {/* Modal de métricas del Honor Choice Watch 2i */}
        <WatchModal
          isOpen={isWatchModalOpen}
          onClose={() => setIsWatchModalOpen(false)}
          onSaveWatchData={(data) => {
            setWatchData(data)
            if (!unlockedBadges.some((b) => b.code === 'WATCH_SYNC')) {
              const watchBadge = BADGES_CATALOG.find((b) => b.code === 'WATCH_SYNC')
              if (watchBadge) {
                setUnlockedBadges((prev) => [...prev, watchBadge])
                setTotalXp((prev) => prev + 100)
                setNewBadgeModal(watchBadge)
              }
            }
          }}
          currentData={watchData}
        />

        {/* Modal de Insignia Desbloqueada */}
        {newBadgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-4xl p-6 max-w-xs w-full text-center shadow-2xl border border-sand-200">
              <div className="w-16 h-16 rounded-3xl bg-carbon-900 text-coral-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-carbon-900/20">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-coral-500 uppercase">
                ¡LOGRO DESBLOQUEADO!
              </div>
              <h3 className="text-xl font-black text-carbon-900 mt-1 mb-1">
                {newBadgeModal.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                {newBadgeModal.description}
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-sand-100 text-xs font-black text-carbon-900 mb-5">
                +{newBadgeModal.xpReward} XP GANADOS
              </div>
              <button
                onClick={() => setNewBadgeModal(null)}
                className="w-full py-3 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Autenticación Permanente */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(session) => setUserSession(session)}
          onSignOut={handleSignOut}
          currentSession={userSession}
        />

        {/* Modal de Creación y Edición de Rutinas */}
        <RoutineEditorModal
          isOpen={isRoutineEditorOpen}
          onClose={() => {
            setIsRoutineEditorOpen(false)
            setEditingRoutine(null)
          }}
          onSaveRoutine={handleSaveRoutine}
          routineToEdit={editingRoutine}
        />

        {/* Modal de Registro de Medidas & Peso Corporal */}
        <BodyMeasurementsModal
          isOpen={isBodyModalOpen}
          onClose={() => setIsBodyModalOpen(false)}
          onSaveMeasurement={handleSaveMeasurement}
          currentWeight={bodyweight}
          lastEntry={bodyMeasurements[0]}
        />

        {/* Temporizador Flotante Global (visible si estás descansando y navegando por otras tabs) */}
        {activeTab !== 'workout' && globalRestSeconds > 0 && (
          <GlobalRestTimer
            restSeconds={globalRestSeconds}
            onAddRestTime={(extra) => {
              if (!activeWorkoutSession) return
              const currentEnds = activeWorkoutSession.restEndsAt || Date.now()
              const updated = {
                ...activeWorkoutSession,
                restEndsAt: currentEnds + extra * 1000
              }
              handleUpdateActiveSession(updated)
            }}
            onCancelRest={() => {
              if (!activeWorkoutSession) return
              const updated = { ...activeWorkoutSession, restEndsAt: null }
              handleUpdateActiveSession(updated)
            }}
            onOpenWorkout={() => setActiveTab('workout')}
          />
        )}

        {/* Barra de navegación flotante dock */}
        <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Indicador de versión en la esquinita */}
        <div className="fixed bottom-1 right-2.5 z-40 pointer-events-none text-[9px] font-mono font-bold text-neutral-400/80 tracking-wider">
          {APP_VERSION}
        </div>
      </div>
    </div>
  )
}