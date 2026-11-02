import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { WeekStrip } from './components/WeekStrip'
import { BodyweightCard } from './components/BodyweightCard'
import { SessionMetricsCard } from './components/SessionMetricsCard'
import { ActionCards } from './components/ActionCards'
import { Navbar } from './components/Navbar'
import { WorkoutLogger } from './components/WorkoutLogger'
import { AchievementsView } from './components/AchievementsView'
import { SettingsView } from './components/SettingsView'
import { WatchModal } from './components/WatchModal'
import { evaluateAchievements } from './lib/overloadEngine'
import { BADGES_CATALOG, DEFAULT_ROUTINES, APP_VERSION } from './lib/constants'
import { syncWorkoutToCloud } from './lib/syncService'
import { Trophy } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [activeRoutineIndex, setActiveRoutineIndex] = useState(0)
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false)

  // Sesión en curso persistente (permanece aunque salgas de la app o vuelvas al home)
  const [activeWorkoutSession, setActiveWorkoutSession] = useState(() => {
    const saved = localStorage.getItem('active_workout_session')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return null
      }
    }
    return null
  })

  const handleUpdateActiveSession = (sessionData) => {
    setActiveWorkoutSession(sessionData)
    localStorage.setItem('active_workout_session', JSON.stringify(sessionData))
  }

  const handleClearActiveSession = () => {
    setActiveWorkoutSession(null)
    localStorage.removeItem('active_workout_session')
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

  // Estado del usuario y peso
  const [bodyweight, setBodyweight] = useState(() => {
    return Number(localStorage.getItem('user_weight')) || 77.9
  })

  // Días completados (Incluye hoy por la sesión de 60 kg)
  const [completedDates, setCompletedDates] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem('completed_workout_dates')
    const list = saved ? JSON.parse(saved) : []
    return list.includes(todayStr) ? list : [...list, todayStr]
  })

  // Entrenamientos completados (Garantiza el registro de los 60 kg de hoy)
  const [workoutsHistory, setWorkoutsHistory] = useState(() => {
    const saved = localStorage.getItem('workouts_history')
    const list = saved ? JSON.parse(saved) : []
    if (list.length === 0 || !list.some(w => w.maxWeight >= 60)) {
      const todaySession = {
        routineId: 'torso-fuerza',
        title: 'Torso — Banca & Inclinado',
        category: 'torso',
        durationMinutes: 40,
        completedAt: new Date().toISOString(),
        totalVolume: 2400,
        maxWeight: 60,
        completedSetsCount: 4,
        watchMetrics: { avgBpm: 135, caloriesBurned: 260 },
        exercises: [
          {
            id: 'bench-press',
            name: 'Press de banca plano',
            sets: [
              { setNumber: 1, weight: 60, reps: 10, completed: true },
              { setNumber: 2, weight: 60, reps: 10, completed: true },
              { setNumber: 3, weight: 60, reps: 9, completed: true },
              { setNumber: 4, weight: 60, reps: 8, completed: true }
            ]
          }
        ]
      }
      return [todaySession, ...list]
    }
    return list
  })

  // Insignias y logros desbloqueados por los 60 kg de hoy
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const earnedCodes = ['FIRST_SESSION', 'BENCH_50KG', 'MAX_WEIGHT_60KG', 'VOLUME_2000KG']
    const autoBadges = BADGES_CATALOG.filter(b => earnedCodes.includes(b.code))
    const saved = localStorage.getItem('unlocked_badges')
    if (saved) {
      try {
        const list = JSON.parse(saved)
        const codes = new Set(list.map(b => b.code))
        const merged = [...list]
        autoBadges.forEach(b => {
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

  // Récords personales (PRs) con los 60 kg de Banca registrados
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

  // Persistencia Local
  useEffect(() => {
    localStorage.setItem('user_weight', bodyweight.toString())
  }, [bodyweight])

  useEffect(() => {
    localStorage.setItem('completed_workout_dates', JSON.stringify(completedDates))
  }, [completedDates])

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

  const handleAddNewRoutine = (newRoutine) => {
    setAllRoutines((prev) => [...prev, newRoutine])
    // Guardar solo las custom en localStorage
    const savedCustom = localStorage.getItem('user_custom_routines')
    const customList = savedCustom ? JSON.parse(savedCustom) : []
    localStorage.setItem('user_custom_routines', JSON.stringify([...customList, newRoutine]))
  }

  // Volumen de la última sesión
  const lastWorkout = workoutsHistory[0]
  const currentSessionVolume = lastWorkout?.totalVolume || 0

  // Manejar finalización de un entrenamiento
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

    // Sincronizar en segundo plano con Supabase Cloud
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

    setActiveTab('home')
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
              streak={Math.max(1, completedDates.length)}
              onOpenCalendar={() => setActiveTab('workout')}
            />

            {/* Strip de la semana con días circulares (L M M J V S D) */}
            <WeekStrip
              completedDates={completedDates}
              activeDate={new Date()}
            />

            {/* Tarjeta de Peso Corporal con mini chart */}
            <BodyweightCard
              weight={bodyweight}
              onUpdateWeight={setBodyweight}
            />

            {/* Métricas de Fuerza & Honor Choice Watch 2i (Volumen circular + BPM) */}
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
              onOpenWatchModal={() => setIsWatchModalOpen(true)}
              lastWatchData={watchData}
              activeSession={activeWorkoutSession}
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
            onAddNewRoutine={handleAddNewRoutine}
            onCompleteWorkout={handleCompleteWorkout}
            onCancel={() => setActiveTab('home')}
            previousHistory={{}}
          />
        )}

        {activeTab === 'achievements' && (
          <div>
            <Header title="Premios" streak={Math.max(1, completedDates.length)} />
            <AchievementsView
              unlockedBadges={unlockedBadges}
              totalXp={totalXp}
              personalRecords={personalRecords}
              streak={Math.max(1, completedDates.length)}
            />
          </div>
        )}

        {activeTab === 'watch' && (
          <div>
            <Header title="Honor Watch" streak={Math.max(1, completedDates.length)} />
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
              <h3 className="text-lg font-black text-carbon-900 mb-1">Honor Choice Watch 2i</h3>
              <p className="text-xs text-neutral-400 mb-4">
                Monitorea pulso, picos cardíacos en series pesadas y gasto calórico.
              </p>
              <button
                onClick={() => setIsWatchModalOpen(true)}
                className="w-full py-3 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all"
              >
                Actualizar Métricas del Reloj
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <Header title="Ajustes" streak={Math.max(1, completedDates.length)} />
            <SettingsView
              userProfile={{ weight: bodyweight }}
              onUpdateProfile={() => {}}
            />
          </div>
        )}

        {/* Modal de métricas del Honor Choice Watch 2i */}
        <WatchModal
          isOpen={isWatchModalOpen}
          onClose={() => setIsWatchModalOpen(false)}
          onSaveWatchData={(data) => {
            setWatchData(data)
            if (!unlockedBadges.some(b => b.code === 'WATCH_SYNC')) {
              const watchBadge = BADGES_CATALOG.find(b => b.code === 'WATCH_SYNC')
              if (watchBadge) {
                setUnlockedBadges(prev => [...prev, watchBadge])
                setTotalXp(prev => prev + 100)
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

        {/* Barra de navegación flotante tipo dock */}
        <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Indicador de versión en la esquinita */}
        <div className="fixed bottom-1 right-2.5 z-40 pointer-events-none text-[9px] font-mono font-bold text-neutral-400/80 tracking-wider">
          {APP_VERSION}
        </div>
      </div>
    </div>
  )
}
