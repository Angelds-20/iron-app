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
  RefreshCw
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
    <div className="space-y-4 animate-fadeIn">
      {/* Strip de la semana con días circulares y racha protegida */}
      <WeekStrip
        completedDates={completedDates}
        restDates={restDates}
        activeDate={new Date()}
        onLogRestDay={onLogRestDay}
      />

      {/* Selector de Pestaña Principal Estilo iOS */}
      <div className="p-1 bg-white/70 backdrop-blur-md rounded-2xl flex items-center gap-1 border border-sand-200/70 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSegment('hub')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'hub'
              ? 'bg-carbon-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-carbon-900'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-coral-500" />
          <span>Hoy & Cargas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('technique')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'technique'
              ? 'bg-carbon-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-carbon-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-coral-500" />
          <span>Técnica & Tips</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('rir')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'rir'
              ? 'bg-carbon-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-carbon-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-coral-500" />
          <span>Guía RIR / RIP</span>
        </button>
      </div>

      {/* 1. VISTA: Hoy & Cargas */}
      {activeSegment === 'hub' && (
        <div className="space-y-4">
          {/* Banner de Sesión en Curso si hay entrenamiento activo */}
          {activeSession?.isActive && (
            <div className="bg-carbon-900 text-white rounded-3xl p-4 shadow-md border border-carbon-800 flex items-center justify-between">
              <div
                onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
                className="cursor-pointer flex-1 pr-2"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-coral-500">
                    SESIÓN EN CURSO
                  </span>
                </div>
                <h3 className="text-base font-black text-white leading-tight">
                  {activeSession.routineIndex === 1
                    ? 'Pierna — Sentadilla & Peso Muerto'
                    : 'Torso — Banca & Inclinado'}
                </h3>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  {completedSetsCount} series registradas • Toca para continuar
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
                  className="px-3 py-1.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-black flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-3 h-3" />
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
                    className="p-1.5 rounded-full bg-carbon-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors"
                    title="Descartar sesión no guardada"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TARJETA MAESTRA: SEGUIMIENTO ENTRE DÍA DE EJERCICIO (AYER) Y DÍA DE DESCANSO (HOY) */}
          {isTodayRest ? (
            /* MODO DÍA DE DESCANSO & SUPERCOMPENSACIÓN (HOY) */
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/70 space-y-4">
              {/* Encabezado del Estado de Recuperación */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <Moon className="w-3 h-3 text-emerald-700" />
                      <span>HOY: DÍA DE DESCANSO ACTIVO</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400">
                      Supercompensación
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-carbon-900 leading-tight">
                    Recuperación Muscular
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Tus fibras musculares se regeneran más densas y fuertes hoy tras la sesión de ayer.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200/60">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              {/* Ficha Comparativa Dividida: Ayer (Ejercicio) vs Hoy (Descanso) */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sand-200/60 text-xs">
                {/* Lado Izquierdo: AYER (EJERCICIO) */}
                <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-carbon-900">
                    <Dumbbell className="w-3 h-3 text-coral-500" />
                    <span>Ayer: Ejercicio</span>
                  </div>
                  <div className="font-extrabold text-carbon-900 leading-tight text-xs">
                    Torso — 6.420 kg
                  </div>
                  <div className="text-[10px] text-neutral-500 leading-snug">
                    15 series efectivas • Banca 60kg, Inclinado 60kg, Remo 60kg, Brazos 14kg.
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 block pt-0.5">
                    Sobrecarga completada
                  </span>
                </div>

                {/* Lado Derecho: HOY (DESCANSO) */}
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    <Moon className="w-3 h-3 text-emerald-600" />
                    <span>Hoy: Descanso</span>
                  </div>
                  <div className="font-extrabold text-emerald-950 leading-tight text-xs">
                    Síntesis Proteica
                  </div>
                  <div className="text-[10px] text-emerald-800 leading-snug">
                    Pecho, espalda y brazos en ventana de reparación de 24h a 48h.
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 block pt-0.5">
                    +50 XP Racha blindada
                  </span>
                </div>
              </div>

              {/* Métricas del Atleta Hoy (Peso en Ayunas + Pulso de Reposo) */}
              <div className="pt-3 border-t border-sand-200/60 grid grid-cols-2 gap-y-3 gap-x-4">
                {/* Peso en Ayunas */}
                <div onClick={onOpenEvolution} className="cursor-pointer group">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Peso en Ayunas
                  </span>
                  <div className="text-lg font-black text-carbon-900 font-mono mt-0.5 flex items-center gap-1">
                    <span>{bodyweight || 120.0}</span>
                    <span className="text-xs font-bold text-neutral-400">kg</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-coral-500 transition-colors" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    Estable • 194 cm
                  </span>
                </div>

                {/* Pulso Honor Watch */}
                <div onClick={onOpenWatchModal} className="cursor-pointer group">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Pulso Watch 2i
                  </span>
                  <div className="text-lg font-black text-carbon-900 font-mono mt-0.5 flex items-center gap-1">
                    <span>{watchData?.avgBpm || 144}</span>
                    <span className="text-xs font-bold text-neutral-400">BPM</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                    Gasto: {watchData?.caloriesBurned || 310} kcal
                  </span>
                </div>
              </div>

              {/* Próximo Entreno & Opción de Entrenar Hoy */}
              <div className="pt-3 border-t border-sand-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                    Próxima Sesión (Mañana)
                  </span>
                  <span className="font-extrabold text-carbon-900 text-xs">
                    Pierna — Sentadilla & Peso Muerto
                  </span>
                </div>

                {/* Botón para cambiar a entrenar hoy si Angel lo decide */}
                <button
                  type="button"
                  onClick={() => onStartWorkout(1)}
                  className="px-3 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-carbon-900 font-bold text-[11px] flex items-center gap-1 border border-sand-200/80 transition-all cursor-pointer"
                  title="Iniciar rutina de pierna hoy"
                >
                  <span>¿Entrenar hoy?</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </button>
              </div>
            </div>
          ) : (
            /* MODO DÍA DE ENTRENAMIENTO (CUANDO HOY SE ENTRENA) */
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/70 space-y-4">
              {/* Cabecera del Entrenamiento */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-coral-600">
                    HOY: DÍA DE ENTRENAMIENTO • 60 KG MÁX
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>48 min • 1:30 descanso</span>
                  </span>
                </div>

                <h2 className="text-xl font-black text-carbon-900 leading-tight">
                  {primaryRoutine.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Banca 60kg (10×3), Inclinado 60kg (10×2 + 1×6), Remo al pecho 60kg (10×3), Francés 14kg (15×3) y Curl 14kg (15×3).
                </p>
              </div>

              {/* Botón Principal de Acción */}
              <button
                type="button"
                onClick={() => onStartWorkout(0)}
                className="w-full py-3.5 px-4 rounded-2xl bg-carbon-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Comenzar Entrenamiento</span>
                <ArrowRight className="w-4 h-4 text-coral-500" />
              </button>

              {/* Sub-Panel de Rendimiento Dividido */}
              <div className="pt-3 border-t border-sand-200/60 grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Volumen Levantado
                  </span>
                  <div className="text-lg font-black text-carbon-900 font-mono mt-0.5">
                    {currentSessionVolume || 6420} <span className="text-xs font-bold text-neutral-400">kg</span>
                  </div>
                  <div className="text-[10px] text-coral-600 font-semibold mt-0.5">
                    {volumePct}% alcanzado (Meta: {targetVolume || 6500}kg)
                  </div>
                </div>

                <div onClick={onOpenEvolution} className="cursor-pointer group">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Peso Corporal
                  </span>
                  <div className="text-lg font-black text-carbon-900 font-mono mt-0.5 flex items-center gap-1">
                    <span>{bodyweight || 120.0}</span>
                    <span className="text-xs font-bold text-neutral-400">kg</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-coral-500 transition-colors" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    Ayunas • 194 cm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Carrusel Horizontal: Píldoras de Técnica & RIR (Snap Scroll) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                PÍLDORAS DE TÉCNICA & RIR
              </span>
              <span className="text-[10px] font-bold text-coral-600">
                Desliza para ver más
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
              {/* Card 1: RIR */}
              <div
                onClick={() => setActiveSegment('rir')}
                className="w-64 flex-shrink-0 snap-start bg-carbon-900 text-white rounded-2xl p-4 shadow-xs cursor-pointer hover:bg-black transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-black text-coral-400 uppercase tracking-wider block mb-1">
                    GUÍA DE ESFUERZO RIR
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    ¿Cuándo subir los 60 kg?
                  </h4>
                  <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
                    Terminar tus 3 series con RIR 2 o 3 es la señal para subir a 12 reps o sumar peso.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-coral-400">
                  <span>Ver escala RIR</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 2: Banca */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-white rounded-2xl p-4 shadow-xs border border-sand-200/70 cursor-pointer hover:border-carbon-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block mb-1">
                    BANCA 60 KG
                  </span>
                  <h4 className="text-sm font-black text-carbon-900 leading-tight">
                    Pausa de 1s en el Pecho
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    A 194 cm, tus brazos largos exigen frenar la inercia para proteger hombros.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-carbon-900">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </div>
              </div>

              {/* Card 3: Inclinado */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-white rounded-2xl p-4 shadow-xs border border-sand-200/70 cursor-pointer hover:border-carbon-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block mb-1">
                    INCLINADO 60 KG
                  </span>
                  <h4 className="text-sm font-black text-carbon-900 leading-tight">
                    Codos en Flecha (75°)
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    No abras los codos a 90°. El ángulo a 75° aísla el pectoral superior.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-carbon-900">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </div>
              </div>

              {/* Card 4: Brazos */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-64 flex-shrink-0 snap-start bg-white rounded-2xl p-4 shadow-xs border border-sand-200/70 cursor-pointer hover:border-carbon-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block mb-1">
                    BRAZOS 14 KG
                  </span>
                  <h4 className="text-sm font-black text-carbon-900 leading-tight">
                    Bajada Excéntrica (3s)
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    Resiste el peso 3 segundos en press francés y curl para máxima hipertrofia.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-carbon-900">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Otras Rutinas Disponibles */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                OTRAS RUTINAS
              </span>
              {onViewAllRoutines && (
                <button
                  type="button"
                  onClick={onViewAllRoutines}
                  className="text-[11px] font-bold text-coral-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Ver todas ({routines.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {routines.slice(1, 2).map((rot, idx) => (
              <div
                key={rot.id || idx}
                onClick={() => onStartWorkout(idx + 1)}
                className="bg-white rounded-2xl p-3.5 shadow-xs border border-sand-200/70 flex items-center justify-between cursor-pointer hover:border-carbon-900 transition-all group"
              >
                <div>
                  <h4 className="text-xs font-black text-carbon-900 group-hover:text-coral-600 transition-colors">
                    {rot.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {rot.exercises?.length || 2} ejercicios • {rot.estimatedTime || '40 min'}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-carbon-900 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
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
