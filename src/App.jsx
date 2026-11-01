import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { WeekStrip } from './components/WeekStrip'
import { BodyweightCard } from './components/BodyweightCard'
import { NutritionCard } from './components/NutritionCard'
import { ActionCards } from './components/ActionCards'
import { Navbar } from './components/Navbar'
import { WorkoutLogger } from './components/WorkoutLogger'
import { AchievementsView } from './components/AchievementsView'
import { MealsLogger } from './components/MealsLogger'
import { SettingsView } from './components/SettingsView'
import { evaluateAchievements } from './lib/overloadEngine'
import { BADGES_CATALOG } from './lib/constants'
import { Sparkles, X, Trophy } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  // Estado del usuario y peso
  const [bodyweight, setBodyweight] = useState(() => {
    return Number(localStorage.getItem('user_weight')) || 77.9
  })

  // Días completados
  const [completedDates, setCompletedDates] = useState(() => {
    const saved = localStorage.getItem('completed_workout_dates')
    return saved ? JSON.parse(saved) : []
  })

  // Entrenamientos completados
  const [workoutsHistory, setWorkoutsHistory] = useState(() => {
    const saved = localStorage.getItem('workouts_history')
    return saved ? JSON.parse(saved) : []
  })

  // Insignias y logros
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('unlocked_badges')
    return saved ? JSON.parse(saved) : []
  })

  // Experiencia total (XP)
  const [totalXp, setTotalXp] = useState(() => {
    return Number(localStorage.getItem('total_xp')) || 0
  })

  // Récords personales (PRs)
  const [personalRecords, setPersonalRecords] = useState(() => {
    const saved = localStorage.getItem('personal_records')
    return saved ? JSON.parse(saved) : { benchPress: 45, squat: 50, deadlift: 60 }
  })

  // Nutrición del día
  const [dailyMeals, setDailyMeals] = useState(() => {
    const saved = localStorage.getItem('daily_meals')
    return saved ? JSON.parse(saved) : []
  })

  // Modal de nueva insignia desbloqueada
  const [newBadgeModal, setNewBadgeModal] = useState(null)

  // Guardar en localStorage ante cambios
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
    localStorage.setItem('daily_meals', JSON.stringify(dailyMeals))
  }, [dailyMeals])

  // Totales de nutrición calculados
  const nutritionTotals = dailyMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fat: acc.fat + (m.fat || 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Manejar finalización de un entrenamiento
  const handleCompleteWorkout = (workoutData) => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    // 1. Agregar fecha a completados si no estaba
    if (!completedDates.includes(todayStr)) {
      setCompletedDates((prev) => [...prev, todayStr])
    }

    // 2. Guardar en historial
    const newHistory = [workoutData, ...workoutsHistory]
    setWorkoutsHistory(newHistory)

    // 3. Evaluar récords personales (PR)
    if (workoutData.maxWeight > (personalRecords.benchPress || 0)) {
      setPersonalRecords((prev) => ({
        ...prev,
        benchPress: workoutData.maxWeight
      }))
    }

    // 4. Evaluar insignias y otorgar XP
    const newBadges = evaluateAchievements(unlockedBadges, workoutData, newHistory)
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges])
      const xpGained = newBadges.reduce((acc, b) => acc + (b.xpReward || 50), 0) + 100 // 100 base por entreno
      setTotalXp((prev) => prev + xpGained)
      setNewBadgeModal(newBadges[0])
    } else {
      setTotalXp((prev) => prev + 100) // 100 base por completar
    }

    // Volver a Home
    setActiveTab('home')
  }

  // Manejar guardado de comida
  const handleAddMeal = (meal) => {
    setDailyMeals((prev) => [meal, ...prev])
    setActiveTab('home')
  }

  return (
    <div className="min-h-screen bg-sand-100 flex justify-center selection:bg-coral-500 selection:text-white">
      {/* Contenedor tipo pantalla móvil / aplicación centrada */}
      <div className="w-full max-w-md px-5 pt-4 pb-20 relative min-h-screen">
        
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

            {/* Tarjeta de Nutrición (Calorías circular + Macros) */}
            <NutritionCard
              caloriesCurrent={nutritionTotals.calories}
              caloriesTarget={2800}
              proteinCurrent={nutritionTotals.protein}
              proteinTarget={180}
              carbsCurrent={nutritionTotals.carbs}
              carbsTarget={300}
              fatCurrent={nutritionTotals.fat}
              fatTarget={70}
            />

            {/* Tarjetas de Acción: Workouts (Start) & Meals (Log) */}
            <ActionCards
              onStartWorkout={() => setActiveTab('workout')}
              onLogMeals={() => setActiveTab('meals')}
            />
          </div>
        )}

        {activeTab === 'workout' && (
          <WorkoutLogger
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

        {activeTab === 'meals' && (
          <MealsLogger
            currentMeals={dailyMeals}
            onAddMeal={handleAddMeal}
            onCancel={() => setActiveTab('home')}
          />
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
      </div>
    </div>
  )
}
