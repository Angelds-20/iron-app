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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl p-6 max-w-sm w-full shadow-2xl border border-sand-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-sand-100 text-neutral-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 border border-sand-200">
            <RefreshCw className="w-4 h-4 text-coral-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              MODIFICAR EJERCICIO
            </span>
            <h3 className="text-base font-black text-carbon-900">Sustituir Ejercicio</h3>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          Reemplaza <span className="font-bold text-carbon-900">{exercise.name}</span> si hoy usaste otra máquina o variante (ej: predicador).
        </p>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Nuevo Nombre del Ejercicio
            </label>
            <input
              type="text"
              placeholder="Ej: Curl Predicador"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none focus:border-coral-500"
              autoFocus
              required
            />
          </div>

          {/* Sugerencias rápidas */}
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Sugerencias Rápidas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewName(sug)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    newName === sug
                      ? 'bg-carbon-900 text-white border-carbon-900'
                      : 'bg-sand-50 text-neutral-600 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle permanente o solo por hoy */}
          <div className="pt-2 border-t border-sand-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={applyPermanently}
                onChange={(e) => setApplyPermanently(e.target.checked)}
                className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 accent-coral-500 cursor-pointer"
              />
              <span className="text-xs text-neutral-600 font-medium">
                Guardar cambio permanente en la rutina
              </span>
            </label>
            <p className="text-[10px] text-neutral-400 ml-6 mt-0.5">
              {applyPermanently
                ? 'Se actualizará para todas las futuras sesiones.'
                : 'Solo afectará a la sesión de hoy.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4 text-coral-500" />
              <span>Confirmar Sustitución</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
