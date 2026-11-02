import React, { useState } from 'react'
import {
  Watch,
  HeartPulse,
  Flame,
  Check,
  Activity,
  RefreshCw,
  Copy,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react'

export function WatchView({ currentData, onSaveData }) {
  const [avgBpm, setAvgBpm] = useState(currentData?.avgBpm || 132)
  const [maxBpm, setMaxBpm] = useState(currentData?.maxBpm || 165)
  const [calories, setCalories] = useState(currentData?.caloriesBurned || 260)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    onSaveData({
      avgBpm: Number(avgBpm),
      maxBpm: Number(maxBpm),
      caloriesBurned: Number(calories),
      updatedAt: new Date().toISOString()
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const applyPreset = (presetAvg, presetMax, presetCal) => {
    setAvgBpm(presetAvg)
    setMaxBpm(presetMax)
    setCalories(presetCal)
  }

  const copyShortcutUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tu-app.onrender.com'
    const template = `${origin}/?watchSync=1&avgBpm=PULSO&maxBpm=PICO&cal=CALORIAS`
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(template)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const testShortcutSync = () => {
    onSaveData({
      avgBpm: 140,
      maxBpm: 172,
      caloriesBurned: 285,
      updatedAt: new Date().toISOString()
    })
    setAvgBpm(140)
    setMaxBpm(172)
    setCalories(285)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Tarjeta Principal de Pulso */}
      <div className="bg-carbon-900 text-white rounded-3xl p-6 shadow-xl border border-carbon-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-carbon-800 flex items-center justify-center text-coral-500">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Honor Choice Watch 2i</h2>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sincronización iPhone & Salud
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center pt-2">
          <div className="p-3 rounded-2xl bg-carbon-800/80 border border-carbon-700/60">
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              BPM MEDIO
            </div>
            <div className="text-2xl font-black font-mono text-coral-500">
              {currentData?.avgBpm || 132}
            </div>
            <span className="text-[10px] text-neutral-400">PPM</span>
          </div>

          <div className="p-3 rounded-2xl bg-carbon-800/80 border border-carbon-700/60">
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              BPM PICO
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {currentData?.maxBpm || 165}
            </div>
            <span className="text-[10px] text-neutral-400">PPM</span>
          </div>

          <div className="p-3 rounded-2xl bg-carbon-800/80 border border-carbon-700/60">
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              CALORÍAS
            </div>
            <div className="text-2xl font-black font-mono text-amber-400">
              {currentData?.caloriesBurned || 260}
            </div>
            <span className="text-[10px] text-neutral-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Automatización con Atajos de iOS (Apple Health) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-coral-500" />
          <h3 className="text-sm font-black text-carbon-900 uppercase tracking-wider">
            Conexión con Atajos de iOS
          </h3>
        </div>
        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          Tu Honor Watch escribe en la app <strong>Honor Health</strong> y ésta se refleja en <strong>Apple Health (Salud)</strong>. Con un Atajo de iOS puedes leer Salud y cargar tus BPM en IRON automáticamente con 1 toque.
        </p>

        {/* Pasos Rápidos */}
        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200/80 mb-4 space-y-2 text-xs text-neutral-600">
          <div className="font-bold text-carbon-900 text-[11px] uppercase tracking-wider">
            Configuración en 3 Pasos:
          </div>
          <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-600">
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
            className="w-full py-3 px-4 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-between shadow-xs"
          >
            <span>Ejecutar Atajo en iPhone ("Sincronizar IRON")</span>
            <ExternalLink className="w-3.5 h-3.5 text-coral-500" />
          </a>

          <button
            type="button"
            onClick={copyShortcutUrl}
            className="w-full py-3 px-4 bg-sand-100 hover:bg-sand-200 text-carbon-900 text-xs font-bold rounded-2xl transition-all flex items-center justify-between border border-sand-200"
          >
            <span>{copiedLink ? '¡Plantilla Copiada al Portapapeles!' : 'Copiar Plantilla de URL para Atajos'}</span>
            <Copy className="w-3.5 h-3.5 text-neutral-500" />
          </button>

          <button
            type="button"
            onClick={testShortcutSync}
            className="w-full py-2.5 px-4 bg-sand-50 hover:bg-sand-100 text-neutral-600 text-xs font-semibold rounded-2xl transition-all flex items-center justify-between border border-dashed border-sand-300"
          >
            <span>Probar Recepción de Atajo (Simulación en Vivo)</span>
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          </button>
        </div>
      </div>

      {/* Formulario de Registro Real */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-coral-500" />
          <h3 className="text-sm font-black text-carbon-900 uppercase tracking-wider">
            Ingreso Manual Directo
          </h3>
        </div>
        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          Si prefieres registrarlo directamente al terminar tu rutina de patio:
        </p>

        {/* Atajos rápidos por tipo de sesión */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Atajos Rápidos de Fuerza:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset(142, 170, 290)}
              className="px-3 py-1.5 rounded-full bg-sand-100 hover:bg-sand-200 text-carbon-900 text-xs font-bold border border-sand-200/80 transition-colors"
            >
              Fuerza Intensa (142 BPM)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(130, 160, 240)}
              className="px-3 py-1.5 rounded-full bg-sand-100 hover:bg-sand-200 text-carbon-900 text-xs font-bold border border-sand-200/80 transition-colors"
            >
              Torso Moderado (130 BPM)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(118, 145, 190)}
              className="px-3 py-1.5 rounded-full bg-sand-100 hover:bg-sand-200 text-carbon-900 text-xs font-bold border border-sand-200/80 transition-colors"
            >
              Descarga / Brazos (118 BPM)
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Pulso Promedio
              </label>
              <div className="flex items-center bg-sand-100 rounded-2xl px-3.5 py-2.5 border border-sand-200">
                <input
                  type="number"
                  value={avgBpm}
                  onChange={(e) => setAvgBpm(e.target.value)}
                  className="w-full bg-transparent text-sm font-black text-carbon-900 outline-none"
                  min="60"
                  max="220"
                  required
                />
                <span className="text-xs font-bold text-neutral-400">BPM</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Pico Máximo
              </label>
              <div className="flex items-center bg-sand-100 rounded-2xl px-3.5 py-2.5 border border-sand-200">
                <input
                  type="number"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                  className="w-full bg-transparent text-sm font-black text-carbon-900 outline-none"
                  min="80"
                  max="240"
                  required
                />
                <span className="text-xs font-bold text-neutral-400">BPM</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Calorías Activas Quemadas
            </label>
            <div className="flex items-center bg-sand-100 rounded-2xl px-3.5 py-2.5 border border-sand-200">
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-transparent text-sm font-black text-carbon-900 outline-none"
                min="50"
                max="2000"
                required
              />
              <span className="text-xs font-bold text-neutral-400">kcal</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
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