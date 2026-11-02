import React, { useState } from 'react'
import { X, RefreshCw, Check, Sparkles, Dumbbell } from 'lucide-react'

export function ExerciseSwapModal({
  isOpen,
  onClose,
  exercise,
  onConfirmSwap
}) {
  const [newName, setNewName] = useState('')
  const [applyPermanently, setApplyPermanently] = useState(false)

  if (!isOpen || !exercise) return null

  // Alternativas populares inteligentes según el ejercicio actual
  const getSuggestions = () => {
    const nameLower = exercise.name.toLowerCase()
    if (nameLower.includes('curl') || nameLower.includes('bíceps')) {
      return ['Curl Predicador', 'Curl Martillo', 'Curl Concentrado', 'Curl 21s']
    }
    if (nameLower.includes('banca') || nameLower.includes('press')) {
      return ['Press con Mancuernas', 'Fondos en Banco', 'Flexiones Lastradas']
    }
    if (nameLower.includes('sentadilla')) {
      return ['Sentadilla Frontal', 'Sentadilla Goblet', 'Sentadilla Búlgara']
    }
    if (nameLower.includes('muerto')) {
      return ['Peso Muerto Rumano (RDL)', 'Buenos Días', 'Hip Thrust']
    }
    return ['Variante con Mancuerna', 'Variante con Barra Corta', 'Variante en Banco']
  }

  const suggestions = getSuggestions()

  const handleSave = (e) => {
    e.preventDefault()
    const targetName = newName.trim() || exercise.name
    if (!targetName) return

    onConfirmSwap({
      oldExerciseId: exercise.id,
      newName: targetName,
      applyPermanently
    })
    setNewName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#18181D] rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/80 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#272731] text-zinc-400 hover:text-white transition-colors cursor-pointer touch-press"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#272731] flex items-center justify-center text-coral-500">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              MODIFICAR EJERCICIO
            </span>
            <h3 className="text-base font-black text-white">Sustituir Ejercicio</h3>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Reemplaza <span className="font-bold text-white">{exercise.name}</span> si hoy usaste otra variante (ej: predicador).
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Nuevo Nombre del Ejercicio
            </label>
            <input
              type="text"
              placeholder="Ej: Curl Predicador"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-3 bg-[#22222A] rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-coral-500"
              autoFocus
              required
            />
          </div>

          {/* Sugerencias rápidas */}
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Sugerencias Rápidas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewName(sug)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer touch-press ${
                    newName === sug
                      ? 'bg-coral-500 text-white'
                      : 'bg-[#22222A] text-zinc-300 hover:text-white'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle permanente o solo por hoy */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={applyPermanently}
                onChange={(e) => setApplyPermanently(e.target.checked)}
                className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 accent-coral-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-300 font-medium">
                Guardar cambio permanente en la rutina
              </span>
            </label>
            <p className="text-[10px] text-zinc-500 ml-6 mt-0.5">
              {applyPermanently
                ? 'Se actualizará para todas las futuras sesiones.'
                : 'Solo afectará a la sesión de hoy.'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-coral-500 hover:bg-coral-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-coral-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer touch-press"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Confirmar Sustitución</span>
          </button>
        </form>
      </div>
    </div>
  )
}
