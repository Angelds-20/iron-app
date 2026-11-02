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
  HelpCircle,
  ChevronRight,
  BookOpen,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react'
import { WeekStrip } from './WeekStrip'
import { ExerciseTechniqueView } from './ExerciseTechniqueView'
import { RirGuideView } from './RirGuideView'

export function HomeHub({
  completedDates,
  restDates,
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

  // Contar series completadas si hay sesión activa
  const completedSetsCount = activeSession?.exerciseData
    ? Object.values(activeSession.exerciseData).flatMap((sets) => sets).filter((s) => s.completed).length
    : 0

  // Rutina principal recomendada (Torso de 60 kg)
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

      {/* Selector Segmentado Estilo iOS (Evita scroll infinito) */}
      <div className="p-1 bg-sand-200/80 rounded-2xl flex items-center gap-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSegment('hub')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'hub'
              ? 'bg-carbon-900 text-white shadow-sm'
              : 'text-neutral-600 hover:text-carbon-900'
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
              ? 'bg-carbon-900 text-white shadow-sm'
              : 'text-neutral-600 hover:text-carbon-900'
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
              ? 'bg-carbon-900 text-white shadow-sm'
              : 'text-neutral-600 hover:text-carbon-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-coral-500" />
          <span>Guía RIR / RIP</span>
        </button>
      </div>

      {/* 1. VISTA: Hoy & Cargas (Dashboard Compacto y Ergonómico) */}
      {activeSegment === 'hub' && (
        <div className="space-y-4">
          {/* Banner de Sesión en Curso si hay entrenamiento activo */}
          {activeSession?.isActive && (
            <div className="bg-carbon-900 text-white rounded-3xl p-4 shadow-lg shadow-carbon-900/15 border border-carbon-800 relative overflow-hidden group">
              <div className="flex items-center justify-between relative z-10">
                <div
                  onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
                  className="cursor-pointer flex-1 pr-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral-500 animate-pulse" />
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-coral-500">
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
            </div>
          )}

          {/* Tarjeta Hero: Entrenamiento Principal de Hoy */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-coral-50 text-coral-600 font-black text-[9px] uppercase tracking-wider">
                    SESIÓN RECOMENDADA
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400">
                    1:30 min descanso
                  </span>
                </div>
                <h2 className="text-lg font-black text-carbon-900 leading-tight">
                  {primaryRoutine.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  Banca 60kg (10x3), Inclinado 60kg (10x2 + 1x6), Remo al pecho 60kg (10x3), Francés 14kg y Curl 14kg.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 font-bold text-carbon-900">
                  <Dumbbell className="w-3.5 h-3.5 text-coral-500" />
                  <span>5 ejercicios</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>48 min</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartWorkout(0)}
                className="px-4 py-2.5 rounded-full bg-carbon-900 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>Entrenar Hoy</span>
                <ArrowRight className="w-3.5 h-3.5 text-coral-500" />
              </button>
            </div>
          </div>

          {/* Grid Compacto 2×2: Métricas Esenciales (Reemplaza las tarjetas gigantes) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Box 1: Volumen */}
            <div className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Volumen Sesión
                </span>
                <span className="text-[10px] font-black text-coral-500 font-mono">
                  {volumePct}%
                </span>
              </div>
              <div className="my-2">
                <div className="text-xl font-black text-carbon-900 font-mono leading-none">
                  {currentSessionVolume || 6420}
                  <span className="text-xs font-bold text-neutral-400 ml-1">kg</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium block mt-1">
                  Meta: {targetVolume || 6500} kg
                </span>
              </div>
              <div className="w-full bg-sand-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-coral-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${volumePct}%` }}
                />
              </div>
            </div>

            {/* Box 2: Peso Corporal */}
            <div
              onClick={onOpenEvolution}
              className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 flex flex-col justify-between cursor-pointer hover:border-carbon-900 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Peso Corporal
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-coral-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="my-2">
                <div className="text-xl font-black text-carbon-900 font-mono leading-none">
                  {bodyweight || 120.0}
                  <span className="text-xs font-bold text-neutral-400 ml-1">kg</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                  Ayunas • 194 cm
                </span>
              </div>
              <span className="text-[10px] font-black text-coral-500 underline decoration-coral-300">
                Ver Medidas & Grasa
              </span>
            </div>

            {/* Box 3: Pulso Honor Watch 2i */}
            <div
              onClick={onOpenWatchModal}
              className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 flex flex-col justify-between cursor-pointer hover:border-carbon-900 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Pulso Watch
                </span>
                <Watch className="w-3.5 h-3.5 text-coral-500" />
              </div>
              <div className="my-2">
                <div className="text-xl font-black text-carbon-900 font-mono leading-none">
                  {watchData?.avgBpm || 144}
                  <span className="text-xs font-bold text-neutral-400 ml-1">BPM</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium block mt-1">
                  Pico: {watchData?.maxBpm || 175} BPM
                </span>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 group-hover:text-carbon-900 transition-colors">
                Honor Watch 2i
              </span>
            </div>

            {/* Box 4: Calorías */}
            <div className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Calorías Activas
                </span>
                <Flame className="w-3.5 h-3.5 text-coral-500" />
              </div>
              <div className="my-2">
                <div className="text-xl font-black text-carbon-900 font-mono leading-none">
                  {watchData?.caloriesBurned || 310}
                  <span className="text-xs font-bold text-neutral-400 ml-1">kcal</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium block mt-1">
                  Gasto por sesión
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">
                Cardio & Fuerza
              </span>
            </div>
          </div>

          {/* Carrusel Horizontal de Píldoras de Técnica & RIR (Snap Scroll - Cero scroll vertical) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                  PÍLDORAS DE TÉCNICA & RIR
                </span>
              </div>
              <span className="text-[10px] font-bold text-coral-500">
                Desliza horizontalmente
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
              {/* Píldora 1: Regla RIR de Sobrecarga */}
              <div
                onClick={() => setActiveSegment('rir')}
                className="w-68 flex-shrink-0 snap-start bg-gradient-to-br from-carbon-900 to-carbon-800 text-white rounded-3xl p-4 shadow-sm border border-carbon-700/80 cursor-pointer hover:border-coral-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-coral-500 text-white text-[9px] font-black uppercase">
                      Guía RIR
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Reps in Reserve</span>
                  </div>
                  <h4 className="text-sm font-black text-white leading-tight">
                    ¿Cuándo subir los 60 kg?
                  </h4>
                  <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
                    Si terminas las 3 series de 10 reps con RIR 2 o 3, ¡estás listo para sumar peso o reps!
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 text-[10px] font-bold text-coral-400">
                  <span>Ver escala completa</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Píldora 2: Press Banca */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-68 flex-shrink-0 snap-start bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 cursor-pointer hover:border-carbon-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-sand-100 text-carbon-900 text-[9px] font-black uppercase">
                      Banca 60 kg
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">Pausa 1s</span>
                  </div>
                  <h4 className="text-sm font-black text-carbon-900 leading-tight">
                    Pausa en el Pecho
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    Cero rebote. Al medir 194 cm, la pausa elimina el estrés lesivo en los hombros.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-sand-200/60 text-[10px] font-bold text-carbon-900">
                  <span>Ver técnica en foto</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </div>
              </div>

              {/* Píldora 3: Press Inclinado */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-68 flex-shrink-0 snap-start bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 cursor-pointer hover:border-carbon-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-sand-100 text-carbon-900 text-[9px] font-black uppercase">
                      Inclinado 60 kg
                    </span>
                    <span className="text-[10px] font-bold text-coral-500">30°-45°</span>
                  </div>
                  <h4 className="text-sm font-black text-carbon-900 leading-tight">
                    Codos a 75 Grados
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    Evita abrir los codos a 90°. La forma de flecha activa el pectoral superior.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-sand-200/60 text-[10px] font-bold text-carbon-900">
                  <span>Ver biomecánica</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </div>
              </div>

              {/* Píldora 4: Brazos 14 kg */}
              <div
                onClick={() => setActiveSegment('technique')}
                className="w-68 flex-shrink-0 snap-start bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 cursor-pointer hover:border-carbon-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-sand-100 text-carbon-900 text-[9px] font-black uppercase">
                      Brazos 14 kg
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">Tempo 3s</span>
                  </div>
                  <h4 className="text-sm font-black text-carbon-900 leading-tight">
                    Bajada Excéntrica Estricta
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    Resiste el peso en 3 segundos tanto en press francés como en curl de bíceps.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-sand-200/60 text-[10px] font-bold text-carbon-900">
                  <span>Ver consejos de brazos</span>
                  <ArrowRight className="w-3 h-3 text-coral-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Acceso Rápido a Rutinas Adicionales */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                OTRAS RUTINAS DISPONIBLES
              </span>
              {onViewAllRoutines && (
                <button
                  type="button"
                  onClick={onViewAllRoutines}
                  className="text-[11px] font-bold text-coral-500 hover:text-coral-600 flex items-center gap-0.5 cursor-pointer"
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
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sand-100 flex items-center justify-center text-carbon-900">
                    <Flame className="w-4 h-4 text-coral-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-carbon-900 group-hover:text-coral-600 transition-colors">
                      {rot.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {rot.exercises?.length || 2} ejercicios • {rot.estimatedTime || '40 min'}
                    </span>
                  </div>
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
