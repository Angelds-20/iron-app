import React, { useState, useEffect } from 'react'
import {
  Utensils,
  Plus,
  RotateCcw,
  Check,
  Flame,
  Zap,
  TrendingUp,
  Database,
  Trash2,
  X,
  Copy,
  CheckCircle2,
  ChevronRight,
  Info,
  Search,
  Sparkles
} from 'lucide-react'
import {
  loadMealPresets,
  saveMealPresets,
  loadTargetMacros,
  saveTargetMacros,
  loadTodayMacros,
  logQuickMealLocalAndRemote,
  removeMealLog,
  MEAL_CATEGORIES,
  SUPABASE_NUTRITION_SQL
} from '../lib/nutritionEngine'

export function NutritionView() {
  const [presets, setPresets] = useState(() => loadMealPresets())
  const [targets, setTargets] = useState(() => loadTargetMacros())
  const [todayMacros, setTodayMacros] = useState(() => loadTodayMacros())
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [isNewPresetOpen, setIsNewPresetOpen] = useState(false)

  // Formulario de nuevo preset
  const [newName, setNewName] = useState('')
  const [newServing, setNewServing] = useState('')
  const [newCalories, setNewCalories] = useState('')
  const [newProtein, setNewProtein] = useState('')
  const [newCarbs, setNewCarbs] = useState('')
  const [newFats, setNewFats] = useState('')
  const [newCategory, setNewCategory] = useState('almuerzo')

  // Notificación flotante temporal
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  // Quick Add: Sumar bloque
  const handleQuickAdd = async (preset, multiplier = 1) => {
    const updated = await logQuickMealLocalAndRemote(preset, multiplier)
    setTodayMacros(updated)
    const portionText = multiplier === 1 ? '1 porción' : multiplier === 0.5 ? '½ porción' : `${multiplier}x`
    showToast(`+${Math.round(preset.calories * multiplier)} kcal • ${preset.name} (${portionText})`)
  }

  // Deshacer último registro
  const handleUndoLast = () => {
    if (!todayMacros.logs || todayMacros.logs.length === 0) return
    const lastLog = todayMacros.logs[0]
    const updated = removeMealLog(lastLog.id)
    setTodayMacros(updated)
    showToast(`Deshecho: -${lastLog.calories} kcal de ${lastLog.name}`)
  }

  // Eliminar un registro específico del día
  const handleRemoveLog = (logId, name, cal) => {
    const updated = removeMealLog(logId)
    setTodayMacros(updated)
    showToast(`Eliminado: -${cal} kcal de ${name}`)
  }

  // Guardar nuevo preset
  const handleCreatePreset = (e) => {
    e.preventDefault()
    if (!newName.trim() || !newCalories) return

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: newName.trim(),
      serving_label: newServing.trim() || '1 Porción',
      calories: Number(newCalories),
      protein: Number(newProtein) || 0,
      carbs: Number(newCarbs) || 0,
      fats: Number(newFats) || 0,
      category: newCategory
    }

    const updated = [...presets, newPreset]
    setPresets(updated)
    saveMealPresets(updated)

    // Reset form
    setNewName('')
    setNewServing('')
    setNewCalories('')
    setNewProtein('')
    setNewCarbs('')
    setNewFats('')
    setIsNewPresetOpen(false)
    showToast(`¡Bloque "${newPreset.name}" creado con éxito!`)
  }

  // Copiar SQL de Supabase
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_NUTRITION_SQL)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  // Calcular métricas
  const calPercent = Math.min(100, Math.round((todayMacros.total_calories / targets.calories) * 100))
  const proPercent = Math.min(100, Math.round((todayMacros.total_protein / targets.protein) * 100))
  const carPercent = Math.min(100, Math.round((todayMacros.total_carbs / targets.carbs) * 100))
  const fatPercent = Math.min(100, Math.round((todayMacros.total_fats / targets.fats) * 100))
  const remainingCalories = Math.max(0, targets.calories - todayMacros.total_calories)

  // Contar cuántas veces se ha comido cada preset hoy
  const countsToday = (presetId) => {
    if (!todayMacros.logs) return 0
    return todayMacros.logs
      .filter((l) => l.presetId === presetId)
      .reduce((acc, curr) => acc + (curr.multiplier || 1), 0)
  }

  // Filtrado por categoría y búsqueda
  const filteredPresets = presets.filter((p) => {
    const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serving_label.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4 pb-32 animate-fadeIn text-white">
      {/* Toast Notification Flotante */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-4 py-2.5 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Acciones Rápidas */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            NUTRICIÓN REAL • DIETA CHILENA
          </span>
          <h2 className="text-xl font-black text-white leading-tight">
            Comidas & Macros
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {todayMacros.logs?.length > 0 && (
            <button
              type="button"
              onClick={handleUndoLast}
              className="p-2 rounded-2xl bg-[#212227] hover:bg-[#2C2D34] text-zinc-300 hover:text-white transition-colors cursor-pointer border border-[#2C2D34]"
              title="Deshacer última comida sumada"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsNewPresetOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-2xl flex items-center gap-1.5 shadow-lg shadow-white/10 transition-transform active:scale-95 cursor-pointer touch-press"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Crear Bloque</span>
          </button>
        </div>
      </div>

      {/* TARJETA 1: TOTALES DIARIOS & BARRA DE PROGRESO */}
      <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34]/40 space-y-4">
        {/* Calorías Totales con Números Grandes */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              CALORÍAS DEL DÍA
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mt-1 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">
              {todayMacros.total_calories}
              <span className="text-base font-bold text-zinc-400 ml-1.5 font-sans">
                / {targets.calories} kcal
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Restantes</span>
            <span className="text-lg font-black text-white font-mono">
              {remainingCalories}{' '}
              <span className="text-xs font-bold text-zinc-400">kcal</span>
            </span>
          </div>
        </div>

        {/* Barra de progreso de calorías */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-[#1A1B20] p-0.5 border border-[#2C2D34] overflow-hidden">
            <div
              style={{ width: `${calPercent}%` }}
              className="h-full rounded-full bg-white transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 px-0.5">
            <span>{calPercent}% de tu meta</span>
            <span>Meta recomendada: {targets.calories} kcal</span>
          </div>
        </div>

        {/* 3 Macro Tarjetas (Proteína, Carbos, Grasas) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Proteína */}
          <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] text-center">
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
              PROTEÍNA
            </span>
            <div className="text-xl font-black text-white mt-1">
              {todayMacros.total_protein}
              <span className="text-xs font-bold text-zinc-400">g</span>
            </div>
            <div className="text-[9px] font-bold text-zinc-400 mt-0.5">
              Meta: {targets.protein}g ({proPercent}%)
            </div>
          </div>

          {/* Carbohidratos */}
          <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] text-center">
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
              CARBOHIDRATOS
            </span>
            <div className="text-xl font-black text-white mt-1">
              {todayMacros.total_carbs}
              <span className="text-xs font-bold text-zinc-400">g</span>
            </div>
            <div className="text-[9px] font-bold text-zinc-400 mt-0.5">
              Meta: {targets.carbs}g ({carPercent}%)
            </div>
          </div>

          {/* Grasas */}
          <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] text-center">
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
              GRASAS
            </span>
            <div className="text-xl font-black text-white mt-1">
              {todayMacros.total_fats}
              <span className="text-xs font-bold text-zinc-400">g</span>
            </div>
            <div className="text-[9px] font-bold text-amber-400 mt-0.5">
              Meta: {targets.fats}g ({fatPercent}%)
            </div>
          </div>
        </div>
      </div>

      {/* SELECTOR DE CATEGORÍAS & FILTROS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              BASE DE COMIDAS CHILENAS (CERO FRICCIÓN)
            </span>
            <h3 className="text-base font-black text-white leading-tight">
              Toca para sumar • Sin pesar nada
            </h3>
          </div>
        </div>

        {/* Chips de Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {MEAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            const count =
              cat.id === 'todos'
                ? presets.length
                : presets.filter((p) => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer touch-press ${
                  isSelected
                    ? 'bg-white text-black shadow-md shadow-white/20'
                    : 'bg-[#212227] text-zinc-400 hover:text-white border border-[#2C2D34]'
                }`}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Buscador Rápido */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar porotos, marraqueta, cazuela, completo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#212227] rounded-2xl text-xs font-medium text-white placeholder-zinc-500 border border-[#2C2D34] outline-none focus:border-zinc-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grid de Bloques de Comida Chilena */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filteredPresets.map((preset) => {
            const eatenCount = countsToday(preset.id)
            return (
              <div
                key={preset.id}
                onClick={() => handleQuickAdd(preset, 1)}
                className="relative rounded-[24px] bg-[#212227] hover:bg-[#28292F] p-4 flex flex-col justify-between min-h-[160px] border border-[#2C2D34] hover:border-zinc-400 transition-all active:scale-[0.98] cursor-pointer group shadow-lg"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-[0_2px_6px_rgba(255,255,255,0.15)]">
                    {preset.calories}
                    <span className="text-xs font-bold text-zinc-400 ml-1 font-sans">
                      kcal
                    </span>
                  </div>

                  {eatenCount > 0 ? (
                    <span className="text-[10px] font-black bg-white text-black px-2 py-0.5 rounded-full shadow-sm">
                      x{eatenCount} hoy
                    </span>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                {/* Info del alimento */}
                <div className="mt-2.5">
                  <h4 className="text-sm font-black text-white leading-tight line-clamp-1">
                    {preset.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5 line-clamp-1">
                    {preset.serving_label}
                  </p>
                </div>

                {/* Macros pills & Botones de Porción rápida */}
                <div className="mt-3 pt-2 border-t border-[#2C2D34]/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-300">
                    <span className="text-white font-extrabold">{preset.protein}g P</span>
                    <span className="text-zinc-600">•</span>
                    <span>{preset.carbs}g C</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">{preset.fats}g G</span>
                  </div>

                  {/* Acceso a media porción o doble ración */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuickAdd(preset, 0.5)
                      }}
                      className="px-1.5 py-0.5 rounded-md bg-[#1A1B20] text-zinc-400 hover:text-white text-[8px] font-bold border border-[#2C2D34] hover:border-zinc-400 transition-colors cursor-pointer"
                      title="Sumar media porción (½)"
                    >
                      ½
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuickAdd(preset, 2)
                      }}
                      className="px-1.5 py-0.5 rounded-md bg-[#1A1B20] text-zinc-400 hover:text-white text-[8px] font-bold border border-[#2C2D34] hover:border-zinc-400 transition-colors cursor-pointer"
                      title="Sumar doble porción (2x)"
                    >
                      2x
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* TARJETA 3: REGISTRO CRONOLÓGICO DE HOY */}
      {todayMacros.logs && todayMacros.logs.length > 0 && (
        <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34]/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                COMIDAS DE HOY
              </span>
              <h3 className="text-base font-black text-white leading-tight mt-0.5">
                Historial ({todayMacros.logs.length} ingresos)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleUndoLast}
              className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Deshacer último</span>
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {todayMacros.logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] flex items-center justify-between group hover:border-zinc-500 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      +{log.calories} kcal
                    </span>
                    <span className="text-xs font-bold text-zinc-200">
                      {log.name}
                    </span>
                    {log.multiplier !== 1 && (
                      <span className="text-[9px] font-black text-zinc-400 bg-[#2C2D34] px-1.5 py-0.5 rounded">
                        {log.multiplier === 0.5 ? '½ porción' : `${log.multiplier}x`}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {log.time} • {log.protein}g P • {log.carbs}g C • {log.fats}g G
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveLog(log.id, log.name, log.calories)}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Eliminar este ingreso"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVO BLOQUE DE COMIDA PERSONALIZADO */}
      {isNewPresetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#212227] rounded-[28px] p-6 max-w-md w-full shadow-2xl border border-[#2C2D34] text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C2D34]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2C2D34] flex items-center justify-center text-white">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    Nuevo Bloque de Comida
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    Guarda tus platos para sumarlos en 1 toque
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPresetOpen(false)}
                className="p-2 rounded-full hover:bg-[#2C2D34] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePreset} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Nombre del Plato / Alimento *
                </label>
                <input
                  type="text"
                  placeholder="ej. Pan con Palta y Atún"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-bold text-white outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Porción
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 1 Marraqueta, 1 Plato"
                    value={newServing}
                    onChange={(e) => setNewServing(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                  >
                    <option value="almuerzo">Platos & Almuerzo</option>
                    <option value="once">La Once & Desayuno</option>
                    <option value="antojo">Antojos & Snacks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Calorías (kcal) *
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 450"
                    value={newCalories}
                    onChange={(e) => setNewCalories(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Proteína (g)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 30"
                    value={newProtein}
                    onChange={(e) => setNewProtein(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Carbohidratos (g)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 50"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Grasas (g)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 15"
                    value={newFats}
                    onChange={(e) => setNewFats(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white border border-[#2C2D34]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer touch-press shadow-xl shadow-white/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar Bloque Frecuente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
