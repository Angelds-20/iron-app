import React, { useState } from 'react'
import { Plus, Trash2, Utensils, ArrowLeft, Check, Sparkles } from 'lucide-react'

export function MealsLogger({ onAddMeal, onCancel, currentMeals = [] }) {
  const [mealName, setMealName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    if (!mealName || !calories) return

    onAddMeal({
      id: Date.now().toString(),
      name: mealName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    setMealName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
  }

  // Comidas sugeridas rápidas para post-entreno
  const quickPresets = [
    { name: 'Batido Proteína + Plátano + Avena', cal: 420, p: 35, c: 55, f: 6 },
    { name: '4 Huevos + Tostadas + Palta/Aguacate', cal: 520, p: 28, c: 35, f: 26 },
    { name: 'Pechuga Pollo + Arroz + Ensalada', cal: 650, p: 50, c: 75, f: 12 }
  ]

  const applyPreset = (preset) => {
    setMealName(preset.name)
    setCalories(preset.cal.toString())
    setProtein(preset.p.toString())
    setCarbs(preset.c.toString())
    setFat(preset.f.toString())
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onCancel}
          className="p-2.5 rounded-full bg-white border border-sand-200 text-carbon-800 hover:bg-sand-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-carbon-900">Registro de Nutrición</h2>
        <div className="w-9" />
      </div>

      {/* Formulario de registro */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-4 h-4 text-coral-500" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Nueva Comida
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Nombre de la comida / Alimento
            </label>
            <input
              type="text"
              placeholder="Ej: Almuerzo post-entreno"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full px-4 py-2.5 bg-sand-100 rounded-2xl text-sm font-semibold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Calorías (kcal)
              </label>
              <input
                type="number"
                placeholder="550"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-4 py-2.5 bg-sand-100 rounded-2xl text-sm font-semibold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Proteína (g)
              </label>
              <input
                type="number"
                placeholder="40"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-4 py-2.5 bg-sand-100 rounded-2xl text-sm font-semibold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Carbohidratos (g)
              </label>
              <input
                type="number"
                placeholder="60"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-4 py-2.5 bg-sand-100 rounded-2xl text-sm font-semibold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Grasas (g)
              </label>
              <input
                type="number"
                placeholder="15"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-4 py-2.5 bg-sand-100 rounded-2xl text-sm font-semibold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-coral-500" />
            <span>Guardar Registro</span>
          </button>
        </form>

        {/* Atajos rápidos */}
        <div className="mt-5 pt-4 border-t border-sand-200">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Plantillas Rápidas
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-full bg-sand-100 hover:bg-sand-200 text-carbon-800 text-[11px] font-semibold border border-sand-200 transition-colors"
              >
                {preset.name.split('+')[0].trim()} ({preset.cal} kcal)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Historial de comidas de hoy */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60">
        <h3 className="text-sm font-bold text-carbon-900 mb-3">Comidas Registradas Hoy</h3>
        {currentMeals.length === 0 ? (
          <p className="text-xs text-neutral-400">Aún no has registrado alimentos hoy.</p>
        ) : (
          <div className="space-y-2">
            {currentMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-sand-50 border border-sand-200/60"
              >
                <div>
                  <div className="text-xs font-bold text-carbon-900">{meal.name}</div>
                  <div className="text-[10px] text-neutral-400">
                    {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g G
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-neutral-400">{meal.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
