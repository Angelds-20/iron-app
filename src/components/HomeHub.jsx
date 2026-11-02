import React, { useState } from 'react'
import {
  Dumbbell,
  ArrowRight,
  Flame,
  Watch,
  Scale,
  TrendingUp,
  Activity,
  Zap,
  ChevronRight,
  BookOpen,
  Trash2,
  Clock,
  Sparkles,
  Moon,
  ShieldCheck,
  Heart,
  RefreshCw,
  CheckCircle2
} from 'lucide-react'
import { WeekStrip } from './WeekStrip'
import { ExerciseTechniqueView } from './ExerciseTechniqueView'
import { RirGuideView } from './RirGuideView'

export function HomeHub({
  completedDates = [],
  restDates = [],
  onLogRestDay,
  bodyweight,
  onUpdateWeight,
  onOpenEvolution,
  currentSessionVolume,
  targetVolume = 6500,
  watchData,
  onOpenWatchModal,
  activeSession,
  onDiscardActiveSession,
  routines = [],
  onStartWorkout,
  onViewAllRoutines
}) {
  const [activeSegment, setActiveSegment] = useState('hub') // 'hub' | 'technique' | 'rir'

  const todayStr = new Date().toISOString().split('T')[0]
  const isTodayRest = restDates.includes(todayStr)

  // Contar series completadas si hay sesión activa
  const completedSetsCount = activeSession?.exerciseData
    ? Object.values(activeSession.exerciseData).flatMap((sets) => sets).filter((s) => s.completed).length
    : 0

  // Rutina principal recomendada
  const primaryRoutine = routines[0] || {
    id: 'torso-fuerza',
    title: 'Torso — Banca & Inclinado',
    category: 'torso',
    estimatedTime: '48 min',
    description: 'Banca 60kg, Inclinado 60kg, Remo 60kg, Francés 14kg y Curl 14kg. 1:30 min descanso.'
  }

  const volumePct = Math.min(100, Math.round(((currentSessionVolume || 0) / (targetVolume || 6500)) * 100))

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Strip de la semana con días circulares y racha protegida */}
      <WeekStrip
        completedDates={completedDates}
        restDates={restDates}
        activeDate={new Date()}
        onLogRestDay={onLogRestDay}
      />

      {/* Selector de Pestaña Principal Estilo Dark Dock */}
      <div className="p-1.5 bg-[#18181D] rounded-2xl flex items-center gap-1.5 shadow-xl shadow-black/30">
        <button
          type="button"
          onClick={() => setActiveSegment('hub')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 touch-press ${
            activeSegment === 'hub'
              ? 'bg-[#272731] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-coral-500" />
          <span>Hoy & Cargas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('technique')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 touch-press ${
            activeSegment === 'technique'
              ? 'bg-[#272731] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-coral-500" />
          <span>Técnica & Tips</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('rir')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 touch-press ${
            activeSegment === 'rir'
              ? 'bg-[#272731] text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-coral-500" />
          <span>Guía RIR / RIP</span>
        </button>
      </div>

      {/* 1. VISTA: Hoy & Cargas */}
      {activeSegment === 'hub' && (
        <div className="space-y-4">
          {/* Banner de Sesión en Curso si hay entrenamiento activo con series completadas */}
          {activeSession?.isActive && completedSetsCount > 0 && (
            <div className="bg-[#18181D] text-white rounded-3xl p-5 shadow-xl shadow-black/40 flex items-center justify-between animate-slideUp">
              <div
                onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
                className="cursor-pointer flex-1 pr-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-coral-500">
                    SESIÓN EN CURSO
                  </span>
                </div>
                <h3 className="text-base font-black text-white leading-tight">
                  {routines[activeSession.routineIndex]?.title ||
                    (activeSession.routineIndex === 1
                      ? 'Pierna — Sentadilla & Peso Muerto'
                      : 'Torso — Banca & Inclinado')}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {completedSetsCount} series completadas • Toca para continuar
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
                  className="px-4 py-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-coral-500/20 transition-all cursor-pointer touch-press"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onDiscardActiveSession && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm('¿Descartar esta sesión en progreso?')) {
                        onDiscardActiveSession()
                      }
                    }}
                    className="p-2 rounded-full bg-[#272731] hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition-colors touch-press"
                    title="Descartar sesión no guardada"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TARJETA MAESTRA: SEGUIMIENTO ENTRE DÍA DE EJERCICIO (AYER) Y DÍA DE DESCANSO (HOY) */}
          {isTodayRest ? (
            /* MODO DÍA DE DESCANSO & SUPERCOMPENSACIÓN (HOY) */
            <div className="bg-[#18181D] rounded-3xl p-6 shadow-xl shadow-black/30 space-y-6">
              {/* Encabezado del Estado de Recuperación */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>HOY: DESCANSO ACTIVO</span>
                    </span>
                    <span className="text-[11px] font-bold text-zinc-500">
                      Supercompensación
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-white leading-tight">
                    Recuperación Muscular
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              {/* SEMÁFORO VISUAL & MAPA DE RECUPERACIÓN MUSCULAR (Cero muros de texto) */}
              <div className="space-y-3 bg-[#22222A] p-4 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    ESTADO POR GRUPO MUSCULAR
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Ventana 24h-48h</span>
                  </span>
                </div>

                {/* 1. Pecho: 45% (Ayer Banca 60kg + Inclinado 60kg) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Pectoral (Banca & Inclinado)</span>
                    <span className="text-[11px] font-mono font-black text-amber-400">45% • Reparando</span>
                  </div>
                  <div className="h-2 w-full bg-[#18181D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>

                {/* 2. Espalda: 55% (Ayer Remo 60kg) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Dorsales & Espalda (Remo)</span>
                    <span className="text-[11px] font-mono font-black text-amber-400">55% • Supercompensando</span>
                  </div>
                  <div className="h-2 w-full bg-[#18181D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '55%' }}
                    />
                  </div>
                </div>

                {/* 3. Brazos: 60% (Ayer Francés 14kg + Curl 14kg) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Tríceps & Bíceps (Brazos)</span>
                    <span className="text-[11px] font-mono font-black text-yellow-400">60% • Síntesis Activa</span>
                  </div>
                  <div className="h-2 w-full bg-[#18181D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>

                {/* 4. Piernas & Core: 100% Fresco para mañana */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Piernas & Core (Sentadilla & PM)</span>
                    <span className="text-[11px] font-mono font-black text-emerald-400">100% • Fresco & Listo</span>
                  </div>
                  <div className="h-2 w-full bg-[#18181D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Ficha Comparativa Dividida: Ayer (Ejercicio) vs Hoy (Descanso) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Lado Izquierdo: AYER (EJERCICIO) */}
                <div className="p-4 rounded-2xl bg-[#22222A] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <Dumbbell className="w-3 h-3 text-coral-500" />
                    <span>Ayer: Ejercicio</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono leading-tight">
                    6.420 <span className="text-xs font-normal text-zinc-500">kg</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    15 series • 60kg / 14kg
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 block pt-0.5">
                    Sobrecarga consolidada
                  </span>
                </div>

                {/* Lado Derecho: HOY (DESCANSO) */}
                <div className="p-4 rounded-2xl bg-[#22222A] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <Moon className="w-3 h-3 text-emerald-400" />
                    <span>Hoy: Descanso</span>
                  </div>
                  <div className="text-xl font-black text-emerald-400 leading-tight">
                    Síntesis
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Regeneración de fibras
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 block pt-0.5">
                    +50 XP Racha blindada
                  </span>
                </div>
              </div>

              {/* Métricas del Atleta Hoy (Jerarquía Radical: Números Masivos) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Peso en Ayunas */}
                <div
                  onClick={onOpenEvolution}
                  className="p-4 rounded-2xl bg-[#22222A] cursor-pointer group touch-press transition-all hover:bg-[#272731]"
                >
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Peso en Ayunas
                  </span>
                  <div className="text-3xl font-black text-white font-mono mt-1 flex items-baseline gap-1">
                    <span>{bodyweight || 120.0}</span>
                    <span className="text-xs font-normal text-zinc-500">kg</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-coral-500 transition-colors ml-auto self-center" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-1">
                    Estable • 194 cm
                  </span>
                </div>

                {/* Pulso Honor Watch */}
                <div
                  onClick={onOpenWatchModal}
                  className="p-4 rounded-2xl bg-[#22222A] cursor-pointer group touch-press transition-all hover:bg-[#272731]"
                >
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Pulso Watch 2i
                  </span>
                  <div className="text-3xl font-black text-white font-mono mt-1 flex items-baseline gap-1">
                    <span>{watchData?.avgBpm || 144}</span>
                    <span className="text-xs font-normal text-zinc-500">BPM</span>
                    <Watch className="w-4 h-4 text-zinc-500 group-hover:text-coral-500 transition-colors ml-auto self-center" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-1">
                    Gasto: {watchData?.caloriesBurned || 310} kcal
                  </span>
                </div>
              </div>

              {/* Próximo Entreno Planificado (Requiere confirmación previa de Angel) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <span>PLANIFICADO PARA MAÑANA</span>
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 bg-[#22222A] px-2.5 py-0.5 rounded-full">
                    Requiere confirmación
                  </span>
                </div>

                <div className="bg-[#22222A] rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-black text-white text-sm block truncate">
                      Pierna — Sentadilla & Peso Muerto
                    </span>
                    <span className="text-xs text-zinc-400 block truncate mt-0.5">
                      4 ejercicios • Sentadilla 60kg, PM 60kg, Zancadas 14kg, Gemelos 60kg
                    </span>
                  </div>

                  {/* Botón con confirmación explícita */}
                  <button
                    type="button"
                    onClick={() => onStartWorkout(1)}
                    className="px-4 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-coral-500/20 transition-all cursor-pointer flex-shrink-0 touch-press"
                    title="Confirmar e iniciar rutina de pierna"
                  >
                    <span>Confirmar / Iniciar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODO DÍA DE ENTRENAMIENTO (CUANDO HOY SE ENTRENA) */
            <div className="bg-[#18181D] rounded-3xl p-6 shadow-xl shadow-black/30 space-y-5">
              {/* Cabecera del Entrenamiento */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-coral-500">
                    HOY: DÍA DE ENTRENAMIENTO • 60 KG MÁX
                  </span>
                  <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>48 min • 1:30 descanso</span>
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white leading-tight">
                  {primaryRoutine.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Banca 60kg (10×3), Inclinado 60kg (10×2 + 1×6), Remo al pecho 60kg (10×3), Francés 14kg (15×3) y Curl 14kg (15×3).
                </p>
              </div>

              {/* Botón Principal de Acción */}
              <button
                type="button"
                onClick={() => onStartWorkout(0)}
                className="w-full py-4 px-5 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-coral-500/25 transition-all cursor-pointer touch-press"
              >
                <span>Comenzar Entrenamiento</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Sub-Panel de Rendimiento Dividido */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#22222A]">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Volumen Levantado
                  </span>
                  <div className="text-3xl font-black text-white font-mono mt-1">
                    {currentSessionVolume || 6420} <span className="text-xs font-normal text-zinc-500">kg</span>
                  </div>
                  <div className="text-[10px] text-coral-500 font-bold mt-1">
                    {volumePct}% alcanzado (Meta: {targetVolume || 6500}kg)
                  </div>
                </div>

                <div
                  onClick={onOpenEvolution}
                  className="p-4 rounded-2xl bg-[#22222A] cursor-pointer group touch-press transition-all hover:bg-[#272731]"
                >
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Peso Corporal
                  </span>
                  <div className="text-3xl font-black text-white font-mono mt-1 flex items-baseline gap-1">
                    <span>{bodyweight || 120.0}</span>
                    <span className="text-xs font-normal text-zinc-500">kg</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-coral-500 transition-colors ml-auto self-center" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                    Ayunas • 194 cm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Carrusel Horizontal: Píldoras de Técnica & RIR (Snap Scroll) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                PÍLDORAS DE TÉCNICA & RIR
              </span>
              <span className="text-[10px] font-bold text-coral-500">
                Desliza para ver más
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
              {/* Card 1: RIR */}
              <div
                onClick={() => setActiveSegment('rir')}
                className="w-64 flex-shrink-0 snap-start bg-[#18181D] hover:bg-[#22222A] text-white rounded-2xl p-5 shadow-lg shadow-black/20 cursor-pointer transition-all flex flex-col justify-between touch-press"
              >
                <div>
                  <span className="text-[9px] font-black text-coral-500 uppercase tracking-wider block mb-1">
                    GUÍA DE ESFUERZO RIR
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    ¿Cuándo subir los 60 kg?
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    Terminar tus 3 series con RIR 2 o 3 es la señal para subir a 12 reps o sumar peso.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-coral-500">
                  <span>Ver escala RIR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Banca */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-[#18181D] hover:bg-[#22222A] rounded-2xl p-5 shadow-lg shadow-black/20 cursor-pointer transition-all flex flex-col justify-between touch-press"
              >
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    BANCA 60 KG
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    Pausa de 1s en el Pecho
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    A 194 cm, tus brazos largos exigen frenar la inercia para proteger hombros.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-coral-500">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Inclinado */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-[#18181D] hover:bg-[#22222A] rounded-2xl p-5 shadow-lg shadow-black/20 cursor-pointer transition-all flex flex-col justify-between touch-press"
              >
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    INCLINADO 60 KG
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    Codos en Flecha (75°)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    No abras los codos a 90°. El ángulo a 75° aísla el pectoral superior.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-coral-500">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 4: Brazos */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-[#18181D] hover:bg-[#22222A] rounded-2xl p-5 shadow-lg shadow-black/20 cursor-pointer transition-all flex flex-col justify-between touch-press"
              >
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    BRAZOS 14 KG
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    Bajada Excéntrica (3s)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    Resiste el peso 3 segundos en press francés y curl para máxima hipertrofia.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-coral-500">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 5: Sentadilla */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-[#18181D] hover:bg-[#22222A] rounded-2xl p-5 shadow-lg shadow-black/20 cursor-pointer transition-all flex flex-col justify-between touch-press"
              >
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    SENTADILLA 60 KG
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    Stance Ancho (Puntas 30°)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    A 194 cm con fémures largos, baja paralelo sin dolor lumbar ni guiño de glúteo.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-coral-500">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 6: Peso Muerto */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-[#18181D] hover:bg-[#22222A] rounded-2xl p-5 shadow-lg shadow-black/20 cursor-pointer transition-all flex flex-col justify-between touch-press"
              >
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    PESO MUERTO 60 KG
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    Barra Pegada a Tibias
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-snug">
                    A 2 cm de tibias. Quita la holgura de la barra y empuja el suelo con talones.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-coral-500">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Otras Rutinas Disponibles */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                OTRAS RUTINAS
              </span>
              {onViewAllRoutines && (
                <button
                  type="button"
                  onClick={onViewAllRoutines}
                  className="text-xs font-bold text-coral-500 hover:text-coral-400 flex items-center gap-0.5 cursor-pointer touch-press"
                >
                  <span>Ver todas ({routines.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {routines.slice(1).map((rot, idx) => (
                <div
                  key={rot.id || idx}
                  onClick={() => onStartWorkout(idx + 1)}
                  className="bg-[#18181D] hover:bg-[#22222A] rounded-2xl p-4 shadow-md flex items-center justify-between cursor-pointer transition-all group touch-press"
                >
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-coral-500 transition-colors">
                      {rot.title}
                    </h4>
                    <span className="text-xs text-zinc-400">
                      {rot.exercises?.length || 4} ejercicios • {rot.estimatedTime || '45 min'} • 1:30 descanso
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. VISTA: Técnica & Fotos con Consejos */}
      {activeSegment === 'technique' && (
        <ExerciseTechniqueView
          onStartExerciseRoutine={() => {
            onStartWorkout(0)
          }}
        />
      )}

      {/* 3. VISTA: Guía Completa RIR / RIP */}
      {activeSegment === 'rir' && <RirGuideView />}
    </div>
  )
}
