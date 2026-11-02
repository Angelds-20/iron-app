import React, { useState } from 'react'
import {
  Database,
  CheckCircle2,
  Dumbbell,
  Sliders,
  RotateCcw,
  Trash2,
  User,
  Scale,
  Ruler,
  Clock,
  Sparkles,
  Save
} from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export function SettingsView({
  userProfile = {},
  onUpdateProfile,
  onResetVolume,
  onClearSession,
  onOpenMeasurementsModal
}) {
  // Estado de edición de Perfil de Atleta
  const [name, setName] = useState(userProfile.name || 'Angel')
  const [weight, setWeight] = useState(userProfile.weight || 120.0)
  const [height, setHeight] = useState(userProfile.height || 194)
  const [restSeconds, setRestSeconds] = useState(userProfile.restSeconds || 90)

  // Estado de edición de Equipamiento de Gimnasio / Patio
  const [mainBarWeight, setMainBarWeight] = useState(userProfile.mainBarWeight || 60)
  const [smallBarWeight, setSmallBarWeight] = useState(userProfile.smallBarWeight || 14)
  const [benchType, setBenchType] = useState(
    userProfile.benchType || 'Plano + Inclinado con soportes'
  )

  // Estado Supabase
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('custom_supabase_url') || ''
  )
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('custom_supabase_key') || ''
  )
  const [savedStatus, setSavedStatus] = useState(false)
  const [actionNotice, setActionNotice] = useState('')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        weight: Number(weight),
        height: Number(height),
        restSeconds: Number(restSeconds),
        mainBarWeight: Number(mainBarWeight),
        smallBarWeight: Number(smallBarWeight),
        benchType
      })
      setActionNotice('¡Perfil de Atleta y Métricas de Gym guardados con éxito!')
      setTimeout(() => setActionNotice(''), 3500)
    }
  }

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
      setActionNotice('¡Volumen restablecido a 6.420 kg!')
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

  return (
    <div className="space-y-4 pb-32 animate-fadeIn text-white">
      {/* Header */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Ajustes & Métricas
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Edita tu peso, medidas corporales y configuración de gimnasio/patio.
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-white text-black font-black text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* FORMULARIO EDITABLE: PERFIL DEL ATLETA & GYM */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        {/* 1. Tarjeta: Perfil del Atleta */}
        <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2D34]">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Perfil de Atleta
              </span>
            </div>
            <span className="text-[10px] font-black text-white bg-[#2C2D34] px-3 py-1 rounded-full uppercase">
              Editable
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Nombre del Atleta
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Estatura (cm)
              </label>
              <input
                type="number"
                step="1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Descanso Series (seg)
              </label>
              <input
                type="number"
                step="5"
                value={restSeconds}
                onChange={(e) => setRestSeconds(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>
          </div>

          {/* Botón rápido para abrir Medidas Corporales */}
          {onOpenMeasurementsModal && (
            <button
              type="button"
              onClick={onOpenMeasurementsModal}
              className="w-full py-3 px-4 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white text-xs font-black flex items-center justify-between transition-all cursor-pointer touch-press"
            >
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-white" />
                <span>Registrar Medidas Antropométricas (Cintura, Bíceps, etc.)</span>
              </div>
              <span className="text-zinc-400">Abrir &rarr;</span>
            </button>
          )}
        </div>

        {/* 2. Tarjeta: Equipamiento de Gimnasio / Patio (GYM) */}
        <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2D34]">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-white" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Equipamiento de Gimnasio (Patio)
              </span>
            </div>
            <span className="text-[10px] font-black text-white bg-[#2C2D34] px-3 py-1 rounded-full uppercase">
              Cargas
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Barra Principal (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={mainBarWeight}
                onChange={(e) => setMainBarWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white"
                required
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Banca, Remo, Sentadilla</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Barra Chica (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={smallBarWeight}
                onChange={(e) => setSmallBarWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-sm font-black text-white font-mono outline-none focus:ring-1 focus:ring-white"
                required
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Francés, Curl, Militar</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Banco & Soportes
            </label>
            <input
              type="text"
              value={benchType}
              onChange={(e) => setBenchType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-white"
              required
            />
          </div>

          {/* Botón de Guardar en Blanco Protagonista */}
          <button
            type="submit"
            className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer touch-press shadow-xl shadow-white/20"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Guardar Perfil & Equipamiento</span>
          </button>
        </div>
      </form>

      {/* 3. Tarjeta: Base de Datos & Supabase */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#2C2D34]">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-white" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Base de Datos
            </span>
          </div>
          <span className="text-[10px] font-black text-white bg-[#1A1B20] border border-[#2C2D34] px-3 py-1 rounded-full uppercase">
            {isSupabaseConfigured || supabaseUrl ? 'Conectado' : 'Local'}
          </span>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-mono text-white outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1A1B20] rounded-xl text-xs font-mono text-white outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2C2D34] hover:bg-white hover:text-black text-white text-xs font-black rounded-xl transition-all cursor-pointer touch-press"
          >
            {savedStatus ? '✓ Credenciales Guardadas' : 'Guardar Credenciales Supabase'}
          </button>
        </form>
      </div>

      {/* 4. Tarjeta: Mantenimiento & Caché */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl space-y-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
          MANTENIMIENTO DE DATOS
        </span>

        <button
          type="button"
          onClick={triggerResetVolume}
          className="w-full py-3 px-4 bg-[#1A1B20] hover:bg-[#2C2D34] text-white text-xs font-black rounded-xl transition-all flex items-center justify-between cursor-pointer touch-press"
        >
          <span>Restablecer Volumen a Ayer (6.420 kg)</span>
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <button
          type="button"
          onClick={triggerClearSession}
          className="w-full py-3 px-4 bg-[#1A1B20] hover:bg-rose-950/40 text-rose-300 text-xs font-black rounded-xl transition-all flex items-center justify-between cursor-pointer touch-press"
        >
          <span>Eliminar Sesión en Progreso Atascada</span>
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>
    </div>
  )
}
