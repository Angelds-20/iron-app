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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#18181D] rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#272731] flex items-center justify-center text-coral-500">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Honor Choice Watch 2i</h3>
              <p className="text-[10px] text-zinc-400 font-semibold">Sincronización iPhone & Salud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#272731] text-zinc-400 hover:text-white transition-colors cursor-pointer touch-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explicación de sincronización */}
        <div className="p-3.5 bg-[#22222A] rounded-2xl text-xs space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
            <Activity className="w-3.5 h-3.5 text-coral-500" />
            <span>Flujo de datos en iPhone:</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Tu reloj envía pulso y calorías a <span className="font-semibold text-white">Honor Health</span>, reflejado en <span className="font-semibold text-white">Apple Health</span>. Registra los valores de tu sesión aquí.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Pulso Promedio
              </label>
              <div className="flex items-center bg-[#22222A] rounded-xl px-3 py-2.5">
                <input
                  type="number"
                  value={avgBpm}
                  onChange={(e) => setAvgBpm(e.target.value)}
                  className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
                />
                <span className="text-[10px] font-normal text-zinc-500">BPM</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Pico Máximo
              </label>
              <div className="flex items-center bg-[#22222A] rounded-xl px-3 py-2.5">
                <input
                  type="number"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                  className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
                />
                <span className="text-[10px] font-normal text-zinc-500">BPM</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Calorías Activas Quemadas
            </label>
            <div className="flex items-center bg-[#22222A] rounded-xl px-3 py-2.5">
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
              />
              <span className="text-[10px] font-normal text-zinc-500">kcal</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-coral-500 hover:bg-coral-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-coral-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer touch-press"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Guardar Métricas del Reloj</span>
          </button>
        </form>
      </div>
    </div>
  )
}
