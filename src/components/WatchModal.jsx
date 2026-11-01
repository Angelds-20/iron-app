import React, { useState } from 'react'
import { Watch, HeartPulse, Flame, Check, X, ShieldCheck, Activity } from 'lucide-react'

export function WatchModal({ isOpen, onClose, onSaveWatchData, currentData = {} }) {
  const [avgBpm, setAvgBpm] = useState(currentData.avgBpm || 135)
  const [maxBpm, setMaxBpm] = useState(currentData.maxBpm || 162)
  const [caloriesBurned, setCaloriesBurned] = useState(currentData.caloriesBurned || 240)

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    onSaveWatchData({
      avgBpm: Number(avgBpm),
      maxBpm: Number(maxBpm),
      caloriesBurned: Number(caloriesBurned),
      updatedAt: new Date().toISOString()
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl p-6 max-w-sm w-full shadow-2xl border border-sand-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 border border-sand-200">
              <Watch className="w-5 h-5 text-coral-500" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-carbon-900">Honor Choice Watch 2i</h3>
              <p className="text-[10px] text-neutral-400 font-semibold">Sincronización iPhone & Salud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sand-100 text-neutral-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explicación de sincronización */}
        <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200/60 mb-4 text-xs text-neutral-600 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-carbon-900 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-coral-500" />
            <span>Flujo de datos en iPhone:</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Tu reloj envía pulso y calorías a la app <span className="font-semibold text-carbon-900">Honor Health</span>, que se refleja en <span className="font-semibold text-carbon-900">Apple Health</span>. Registra los valores de tu sesión aquí para vincularlos a tus récords de fuerza.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Pulso Promedio
              </label>
              <div className="flex items-center bg-sand-100 rounded-xl px-3 py-2 border border-sand-200">
                <input
                  type="number"
                  value={avgBpm}
                  onChange={(e) => setAvgBpm(e.target.value)}
                  className="w-full bg-transparent text-sm font-black text-carbon-900 outline-none"
                />
                <span className="text-[10px] font-bold text-neutral-400">BPM</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Pico Máximo
              </label>
              <div className="flex items-center bg-sand-100 rounded-xl px-3 py-2 border border-sand-200">
                <input
                  type="number"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                  className="w-full bg-transparent text-sm font-black text-carbon-900 outline-none"
                />
                <span className="text-[10px] font-bold text-neutral-400">BPM</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Calorías Activas Quemadas
            </label>
            <div className="flex items-center bg-sand-100 rounded-xl px-3 py-2 border border-sand-200">
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-transparent text-sm font-black text-carbon-900 outline-none"
              />
              <span className="text-[10px] font-bold text-neutral-400">kcal</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-coral-500" />
            <span>Guardar Métricas del Reloj</span>
          </button>
        </form>
      </div>
    </div>
  )
}
