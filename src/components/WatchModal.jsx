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
      <div className="bg-[#212227] border border-[#2C2D34] rounded-[28px] p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#2C2D34]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2C2D34] flex items-center justify-center text-white">
              <Watch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Honor Choice Watch 2i</h3>
              <p className="text-[10px] text-zinc-400 font-semibold">Sincronización iPhone & Salud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#2C2D34] text-zinc-400 hover:text-white transition-colors cursor-pointer touch-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explicación de sincronización */}
        <div className="p-3.5 bg-[#1A1B20] border border-[#2C2D34] rounded-2xl text-xs space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
            <Activity className="w-3.5 h-3.5 text-white" />
            <span>Flujo de datos en iPhone:</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Tu reloj envía pulso y calorías a <span className="font-semibold text-white">Honor Health</span>, reflejado en <span className="font-semibold text-white">Apple Health</span>. Registra los valores de tu sesión aquí.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Pulso Promedio
              </label>
              <div className="flex items-center bg-[#1A1B20] border border-[#2C2D34] rounded-xl px-3 py-2.5">
                <input
                  type="number"
                  value={avgBpm}
                  onChange={(e) => setAvgBpm(e.target.value)}
                  className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
                />
                <span className="text-[10px] font-bold text-zinc-500">BPM</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Pico Máximo
              </label>
              <div className="flex items-center bg-[#1A1B20] border border-[#2C2D34] rounded-xl px-3 py-2.5">
                <input
                  type="number"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                  className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
                />
                <span className="text-[10px] font-bold text-zinc-500">BPM</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Calorías Activas Quemadas
            </label>
            <div className="flex items-center bg-[#1A1B20] border border-[#2C2D34] rounded-xl px-3 py-2.5">
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
              />
              <span className="text-[10px] font-bold text-zinc-500">kcal</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-2xl shadow-xl shadow-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer touch-press"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Guardar Métricas del Reloj</span>
          </button>
        </form>
      </div>
    </div>
  )
}
