import React, { useState } from 'react'
import {
  Database,
  CloudUpload,
  CheckCircle2,
  HardDrive,
  Dumbbell,
  Sliders,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export function SettingsView({ userProfile, onUpdateProfile, onResetVolume, onClearSession }) {
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('custom_supabase_url') || ''
  )
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('custom_supabase_key') || ''
  )
  const [savedStatus, setSavedStatus] = useState(false)
  const [actionNotice, setActionNotice] = useState('')

  const handleSaveSupabase = (e) => {
    e.preventDefault()
    localStorage.setItem('custom_supabase_url', supabaseUrl)
    localStorage.setItem('custom_supabase_key', supabaseKey)
    setSavedStatus(true)
    setTimeout(() => setSavedStatus(false), 3000)
  }

  const triggerResetVolume = () => {
    if (onResetVolume) {
      onResetVolume()
      setActionNotice('¡Volumen restablecido a 2.400 kg (Banca 60 kg)!')
      setTimeout(() => setActionNotice(''), 3000)
    }
  }

  const triggerClearSession = () => {
    if (onClearSession) {
      onClearSession()
      setActionNotice('¡Sesión en progreso eliminada con éxito!')
      setTimeout(() => setActionNotice(''), 3000)
    }
  }

  const forceReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
        <h2 className="text-xl font-black text-carbon-900 tracking-tight">
          Ajustes & Conectividad
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configura tu base de datos Supabase y equipamiento de entrenamiento.
        </p>
      </div>

      {/* Estado del Almacenamiento */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-coral-500" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Modo de Base de Datos
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-carbon-900">
                {isSupabaseConfigured || supabaseUrl
                  ? 'Supabase Conectado'
                  : 'Modo Local Activo (Offline)'}
              </div>
              <div className="text-[10px] text-neutral-400">
                {isSupabaseConfigured || supabaseUrl
                  ? 'Tus datos se sincronizan con la nube'
                  : 'Tus entrenamientos se guardan de forma instantánea y segura en tu navegador'}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario Supabase */}
        <form onSubmit={handleSaveSupabase} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sand-100 rounded-xl text-xs font-mono text-carbon-900 border border-sand-200 outline-none focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">
              Supabase Anon Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sand-100 rounded-xl text-xs font-mono text-carbon-900 border border-sand-200 outline-none focus:border-coral-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all"
          >
            {savedStatus ? 'Credenciales Guardadas' : 'Guardar Credenciales Supabase'}
          </button>
        </form>
      </div>

      {/* Configuración de Equipamiento de Patio */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell className="w-4 h-4 text-coral-500" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Equipamiento Registrado
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-carbon-900">Barra Principal</div>
              <div className="text-[11px] text-neutral-400">Press banca, sentadillas, peso muerto</div>
            </div>
            <span className="font-extrabold text-coral-500 text-sm">60 kg máx</span>
          </div>

          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-carbon-900">Barra Chica</div>
              <div className="text-[11px] text-neutral-400">Press francés, curl de bíceps, hombros</div>
            </div>
            <span className="font-extrabold text-carbon-900 text-sm">14 kg fija</span>
          </div>

          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-carbon-900">Banco de Fuerza</div>
              <div className="text-[11px] text-neutral-400">Con soporte integrado para barra</div>
            </div>
            <span className="font-bold text-neutral-600 text-xs">Plano + Inclinado</span>
          </div>
        </div>
      </div>

      {/* Control de Datos & Caché */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <RotateCcw className="w-4 h-4 text-coral-500" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Control de Datos & Mantenimiento
          </span>
        </div>
        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          Si notas métricas acumuladas de pruebas o una sesión en progreso atascada, límpialas aquí con un toque.
        </p>

        {actionNotice && (
          <div className="p-3 mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={triggerResetVolume}
            className="w-full py-3 px-4 bg-sand-100 hover:bg-sand-200 text-carbon-900 text-xs font-bold rounded-2xl transition-all flex items-center justify-between border border-sand-200"
          >
            <span>Restablecer Volumen Real a Hoy (2.400 kg)</span>
            <RotateCcw className="w-3.5 h-3.5 text-coral-500" />
          </button>

          <button
            type="button"
            onClick={triggerClearSession}
            className="w-full py-3 px-4 bg-sand-100 hover:bg-rose-50 hover:text-rose-600 text-carbon-900 text-xs font-bold rounded-2xl transition-all flex items-center justify-between border border-sand-200"
          >
            <span>Eliminar Sesión en Progreso Atascada</span>
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </button>

          <button
            type="button"
            onClick={forceReload}
            className="w-full py-3 px-4 bg-sand-100 hover:bg-sand-200 text-carbon-900 text-xs font-bold rounded-2xl transition-all flex items-center justify-between border border-sand-200"
          >
            <span>Forzar Recarga de la Web (Limpiar Caché)</span>
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Deploy a Render */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60">
        <div className="flex items-center gap-2 mb-2">
          <CloudUpload className="w-4 h-4 text-carbon-900" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Despliegue en Render
          </span>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed mb-3">
          El proyecto incluye <code className="bg-sand-100 px-1 py-0.5 rounded text-[11px] text-carbon-900">render.yaml</code> y <code className="bg-sand-100 px-1 py-0.5 rounded text-[11px] text-carbon-900">Dockerfile</code> listo para conectar con tu repositorio de GitHub y tener tu app online en minutos.
        </p>
      </div>
    </div>
  )
}
