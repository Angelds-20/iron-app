import React, { useState } from 'react'
import {
  Watch,
  HeartPulse,
  Flame,
  Zap,
  Activity,
  Check,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export function WatchView({ onSaveWatchData, currentData = {} }) {
  const [avgBpm, setAvgBpm] = useState(currentData?.avgBpm || 135)
  const [maxBpm, setMaxBpm] = useState(currentData?.maxBpm || 162)
  const [calories, setCalories] = useState(currentData?.caloriesBurned || 240)
  const [copiedLink, setCopiedLink] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Genera la URL real de sincronización para Atajos de iOS
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://10.76.19.43:3000'
  const sampleUrl = `${baseUrl}/?avgBpm=138&maxBpm=168&calories=285`

  const copyShortcutUrl = () => {
    navigator.clipboard.writeText(sampleUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const applyPreset = (avg, max, cal) => {
    setAvgBpm(avg)
    setMaxBpm(max)
    setCalories(cal)
  }

  const testShortcutSync = () => {
    const randomAvg = Math.floor(Math.random() * 20) + 128
    const randomMax = randomAvg + Math.floor(Math.random() * 30) + 18
    const randomCal = Math.floor(Math.random() * 80) + 220
    applyPreset(randomAvg, randomMax, randomCal)
    onSaveWatchData({
      avgBpm: randomAvg,
      maxBpm: randomMax,
      caloriesBurned: randomCal,
      updatedAt: new Date().toISOString()
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSaveWatchData({
      avgBpm: Number(avgBpm),
      maxBpm: Number(maxBpm),
      caloriesBurned: Number(calories),
      updatedAt: new Date().toISOString()
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="space-y-4 pb-24 animate-fadeIn text-white">
      {/* Tarjeta Principal de Pulso */}
      <div className="bg-[#212227] text-white rounded-[28px] p-6 shadow-xl border border-[#2C2D34]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2C2D34] flex items-center justify-center text-white">
              <Watch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Honor Choice Watch 2i</h2>
              <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse" />
                Sincronización iPhone & Salud
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center pt-2">
          <div className="p-3 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              BPM MEDIO
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {currentData?.avgBpm || 132}
            </div>
            <span className="text-[10px] text-zinc-500 font-bold">PPM</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              BPM PICO
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {currentData?.maxBpm || 165}
            </div>
            <span className="text-[10px] text-zinc-500 font-bold">PPM</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
              CALORÍAS
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {currentData?.caloriesBurned || 260}
            </div>
            <span className="text-[10px] text-zinc-500 font-bold">kcal</span>
          </div>
        </div>
      </div>

      {/* Automatización con Atajos de iOS (Apple Health) */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl border border-[#2C2D34]">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#2C2D34]">
          <Zap className="w-4 h-4 text-white" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Conexión con Atajos de iOS
          </h3>
        </div>
        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
          Tu Honor Watch escribe en la app <strong>Honor Health</strong> y ésta se refleja en <strong>Apple Health (Salud)</strong>. Con un Atajo de iOS puedes leer Salud y cargar tus BPM en IRON automáticamente con 1 toque.
        </p>

        {/* Pasos Rápidos */}
        <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] mb-4 space-y-2 text-xs text-zinc-300">
          <div className="font-black text-white text-[10px] uppercase tracking-wider">
            Configuración en 3 Pasos:
          </div>
          <ol className="list-decimal pl-4 space-y-1 text-xs text-zinc-400">
            <li>
              En <strong>Honor Health</strong>: Activa compartir datos con <strong>Apple Health (Salud)</strong> en Ajustes.
            </li>
            <li>
              En la app <strong>Atajos de iOS</strong>: Crea un atajo llamado <em>"Sincronizar IRON"</em> con la acción <em>Buscar muestras de Salud (Frecuencia cardíaca)</em> y <em>Abrir URL</em>.
            </li>
            <li>
              Al terminar de entrenar, toca el widget de Atajo o usa el botón de abajo.
            </li>
          </ol>
        </div>

        <div className="space-y-2">
          <a
            href="shortcuts://run-shortcut?name=Sincronizar%20IRON"
            className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-2xl transition-all flex items-center justify-between shadow-xl shadow-white/20"
          >
            <span>Ejecutar Atajo en iPhone ("Sincronizar IRON")</span>
            <ExternalLink className="w-3.5 h-3.5 text-black stroke-[3]" />
          </a>

          <button
            type="button"
            onClick={copyShortcutUrl}
            className="w-full py-3 px-4 bg-[#1A1B20] hover:bg-[#2C2D34] text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-between border border-[#2C2D34]"
          >
            <span>{copiedLink ? '¡Plantilla Copiada al Portapapeles!' : 'Copiar Plantilla de URL para Atajos'}</span>
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={testShortcutSync}
            className="w-full py-2.5 px-4 bg-[#1A1B20] hover:bg-[#2C2D34] text-zinc-300 hover:text-white text-xs font-semibold rounded-2xl transition-all flex items-center justify-between border border-dashed border-[#2C2D34]"
          >
            <span>Probar Recepción de Atajo (Simulación en Vivo)</span>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Formulario de Registro Real */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl border border-[#2C2D34]">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#2C2D34]">
          <Activity className="w-4 h-4 text-white" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Ingreso Manual Directo
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
          Si prefieres registrarlo directamente al terminar tu rutina de patio:
        </p>

        {/* Atajos rápidos por tipo de sesión */}
        <div className="mb-4">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
            Atajos Rápidos de Fuerza:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset(142, 170, 290)}
              className="px-3.5 py-1.5 rounded-full bg-[#1A1B20] hover:bg-[#2C2D34] text-white text-xs font-bold border border-[#2C2D34] transition-colors"
            >
              Fuerza Intensa (142 BPM)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(130, 160, 240)}
              className="px-3.5 py-1.5 rounded-full bg-[#1A1B20] hover:bg-[#2C2D34] text-white text-xs font-bold border border-[#2C2D34] transition-colors"
            >
              Torso Moderado (130 BPM)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(118, 145, 190)}
              className="px-3.5 py-1.5 rounded-full bg-[#1A1B20] hover:bg-[#2C2D34] text-white text-xs font-bold border border-[#2C2D34] transition-colors"
            >
              Descarga / Brazos (118 BPM)
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Pulso Promedio
              </label>
              <div className="flex items-center bg-[#1A1B20] rounded-xl px-3.5 py-2.5 border border-[#2C2D34]">
                <input
                  type="number"
                  value={avgBpm}
                  onChange={(e) => setAvgBpm(e.target.value)}
                  className="w-full bg-transparent text-sm font-black text-white outline-none"
                  min="60"
                  max="220"
                  required
                />
                <span className="text-xs font-bold text-zinc-400">BPM</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Pico Máximo
              </label>
              <div className="flex items-center bg-[#1A1B20] rounded-xl px-3.5 py-2.5 border border-[#2C2D34]">
                <input
                  type="number"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                  className="w-full bg-transparent text-sm font-black text-white outline-none"
                  min="80"
                  max="240"
                  required
                />
                <span className="text-xs font-bold text-zinc-400">BPM</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Calorías Activas Quemadas
            </label>
            <div className="flex items-center bg-[#1A1B20] rounded-xl px-3.5 py-2.5 border border-[#2C2D34]">
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-transparent text-sm font-black text-white outline-none"
                min="50"
                max="2000"
                required
              />
              <span className="text-xs font-bold text-zinc-400">kcal</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/20 cursor-pointer touch-press"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>¡Métricas Reales Guardadas!</span>
              </>
            ) : (
              <span>Guardar en IRON</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
