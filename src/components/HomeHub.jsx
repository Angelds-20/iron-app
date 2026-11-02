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
  CheckCircle2,
  SlidersHorizontal,
  Plus
} from 'lucide-react'
import { ExerciseTechniqueView } from './ExerciseTechniqueView'
import { RirGuideView } from './RirGuideView'

// Componente de anillo de progreso circular idéntico al de la captura
function ProgressCircle({ number = 1, progress = 70, size = 48 }) {
  const strokeWidth = 3
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2C2D34"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-extrabold text-white">{number}</span>
    </div>
  )
}

// Matriz de puntos de actividad mensual idéntica a la de la captura
function DotMatrixHeatmap() {
  const months = [
    {
      name: 'Jan',
      dots: [
        0, 0, 1, 0, 0, 0,
        0, 1, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0
      ]
    },
    {
      name: 'Feb',
      dots: [
        0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0
      ]
    },
    {
      name: 'Mar',
      dots: [
        0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0
      ]
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4 pb-2">
      {months.map((m) => (
        <div key={m.name} className="space-y-2.5">
          <span className="text-[11px] font-bold text-white block text-center">
            {m.name}
          </span>
          <div className="grid grid-cols-6 gap-x-1.5 gap-y-2 justify-items-center">
            {m.dots.map((active, i) => (
              <span
                key={i}
                className={`rounded-full transition-all ${
                  active
                    ? 'w-1.5 h-1.5 bg-white shadow-xs shadow-white/80'
                    : 'w-1 h-1 bg-[#3A3C46]/70'
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

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
  const [activeSegment, setActiveSegment] = useState('workouts') // 'workouts' | 'recovery' | 'technique' | 'rir'

  const todayStr = new Date().toISOString().split('T')[0]
  const isTodayRest = restDates.includes(todayStr)

  // Contar series completadas si hay sesión activa
  const completedSetsCount = activeSession?.exerciseData
    ? Object.values(activeSession.exerciseData).flatMap((sets) => sets).filter((s) => s.completed).length
    : 0

  const primaryRoutine = routines[0] || {
    id: 'torso-fuerza',
    title: 'Torso — Banca & Inclinado',
    category: 'torso',
    estimatedTime: '48 min',
    description: 'Banca 60kg, Inclinado 60kg, Remo 60kg, Francés 14kg y Curl 14kg.'
  }

  const secondaryRoutine = routines[1] || {
    id: 'pierna-fuerza',
    title: 'Pierna — Sentadilla & Peso Muerto',
    category: 'pierna',
    estimatedTime: '45 min',
    description: 'Sentadilla 60kg, PM 60kg, Zancadas 14kg, Gemelos 60kg.'
  }

  const displayVolume = currentSessionVolume || 6420

  return (
    <div className="space-y-3.5 animate-fadeIn pb-24">
      {/* Selector de Modos Sutil Superior */}
      <div className="flex items-center gap-2 px-1">
        <button
          type="button"
          onClick={() => setActiveSegment('workouts')}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer touch-press ${
            activeSegment === 'workouts'
              ? 'bg-[#212227] text-white shadow-sm'
              : 'text-[#8E909A] hover:text-white'
          }`}
        >
          Workouts
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment('recovery')}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer touch-press ${
            activeSegment === 'recovery'
              ? 'bg-[#212227] text-white shadow-sm'
              : 'text-[#8E909A] hover:text-white'
          }`}
        >
          Recuperación Muscular
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment('technique')}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer touch-press ${
            activeSegment === 'technique'
              ? 'bg-[#212227] text-white shadow-sm'
              : 'text-[#8E909A] hover:text-white'
          }`}
        >
          Técnica & RIR
        </button>
      </div>

      {/* Banner de Sesión en Curso si hay entrenamiento activo */}
      {activeSession?.isActive && completedSetsCount > 0 && (
        <div className="bg-[#212227] text-white rounded-[24px] p-5 shadow-xl flex items-center justify-between animate-slideUp">
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
            <h3 className="text-base font-extrabold text-white leading-tight">
              {routines[activeSession.routineIndex]?.title || 'Torso — Banca & Inclinado'}
            </h3>
            <p className="text-xs text-[#8E909A] mt-1">
              {completedSetsCount} series completadas • Toca para continuar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
              className="px-4 py-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer touch-press"
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
                className="p-2 rounded-full bg-[#2C2D34] text-[#8E909A] hover:text-rose-400 transition-colors touch-press"
                title="Descartar sesión no guardada"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. VISTA PRINCIPAL: EXACTAMENTE COMO EN LA CAPTURA */}
      {activeSegment === 'workouts' && (
        <div className="space-y-3.5">
          {/* Fila 1: Dos tarjetas cuadradas idénticas a la captura */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Tarjeta 1 (Izquierda): Rutina 1 (Chest + tricep / Torso) */}
            <div
              onClick={() => onStartWorkout(0)}
              className="rounded-[28px] bg-[#212227] p-5 flex flex-col justify-between min-h-[165px] transition-transform active:scale-[0.98] cursor-pointer group shadow-lg"
            >
              <div className="flex items-start justify-between">
                <ProgressCircle number={1} progress={75} size={48} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewAllRoutines && onViewAllRoutines()
                  }}
                  className="text-[#565863] group-hover:text-white transition-colors p-1"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white leading-snug">
                  Chest + tricep
                </h3>
                <p className="text-xs text-[#8E909A] font-medium mt-0.5">
                  Ayer • 60kg listo
                </p>
              </div>
            </div>

            {/* Tarjeta 2 (Derecha): Body weight (Peso corporal) */}
            <div
              onClick={onOpenEvolution}
              className="rounded-[28px] bg-[#212227] p-5 flex flex-col justify-between min-h-[165px] transition-transform active:scale-[0.98] cursor-pointer group shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
                  {Math.round(bodyweight || 120)} <span className="text-base font-normal text-[#8E909A]">kg</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenEvolution && onOpenEvolution()
                  }}
                  className="text-[#565863] group-hover:text-white transition-colors p-1"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white leading-snug">
                  Body weight
                </h3>
                <p className="text-xs text-[#8E909A] font-medium mt-0.5">
                  Hoy en ayunas
                </p>
              </div>
            </div>
          </div>

          {/* Fila 2: Tarjeta Ancha Central con Matriz de Puntos y Rutina 2 */}
          <div className="rounded-[28px] bg-[#212227] p-6 space-y-5 shadow-lg">
            {/* Matriz de Puntos de Actividad Jan / Feb / Mar */}
            <DotMatrixHeatmap />

            {/* Sección Inferior: Rutina 2 (Back + bicep + legs) */}
            <div
              onClick={() => onStartWorkout(1)}
              className="pt-4 border-t border-[#2C2D34]/80 flex items-center justify-between cursor-pointer group transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <ProgressCircle number={2} progress={35} size={44} />
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-white leading-snug truncate">
                    Back + bicep + legs
                  </h3>
                  <p className="text-xs text-[#8E909A] font-medium mt-0.5 truncate">
                    Mondays • Pierna & PM
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-[#565863] group-hover:text-white transition-colors p-2 flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fila 3: Tarjeta Horizontal de Volumen Levantado */}
          <div
            onClick={onOpenEvolution}
            className="rounded-[24px] bg-[#212227] p-5 flex items-center justify-between transition-transform active:scale-[0.99] cursor-pointer group shadow-lg"
          >
            <div>
              <h4 className="text-sm font-extrabold text-white leading-snug">
                Volume lifted
              </h4>
              <p className="text-xs text-[#8E909A] font-medium mt-0.5">
                Last 7 days • 15 series
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {displayVolume.toLocaleString()} <span className="text-sm font-normal text-[#8E909A]">kg</span>
              </span>
              <SlidersHorizontal className="w-4 h-4 text-[#565863] group-hover:text-white transition-colors ml-3.5" />
            </div>
          </div>

          {/* Fila 4: Tarjeta de Añadir Rutina / Entrenamiento (+) de la captura */}
          <div
            onClick={() => (onViewAllRoutines ? onViewAllRoutines() : onStartWorkout(0))}
            className="rounded-[28px] bg-[#212227] p-8 flex items-center justify-center text-[#565863] hover:text-white transition-all cursor-pointer active:scale-[0.98] shadow-lg group"
            title="Añadir nuevo entrenamiento o rutina"
          >
            <Plus className="w-8 h-8 stroke-[2] group-hover:scale-110 transition-transform" />
          </div>
        </div>
      )}

      {/* 2. VISTA: Recuperación Muscular (Integrada con el mismo estilo matte oscuro) */}
      {activeSegment === 'recovery' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="rounded-[28px] bg-[#212227] p-6 space-y-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 w-max mb-2">
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HOY: DESCANSO ACTIVO</span>
                </span>
                <h2 className="text-2xl font-extrabold text-white leading-tight">
                  Recuperación Muscular
                </h2>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-[#2C2D34] text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            {/* Dashboard Visual de Recuperación */}
            <div className="space-y-3.5 bg-[#1A1B20] p-4 rounded-2xl">
              <span className="text-[10px] font-black text-[#8E909A] uppercase tracking-widest block mb-2">
                ESTADO POR GRUPO MUSCULAR
              </span>

              {/* Pecho: 45% */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">Pectoral (Banca & Inclinado)</span>
                  <span className="text-[11px] font-mono font-black text-amber-400">45% • Reparando</span>
                </div>
                <div className="h-2 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Espalda: 55% */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">Dorsales & Espalda (Remo)</span>
                  <span className="text-[11px] font-mono font-black text-amber-400">55% • Supercompensando</span>
                </div>
                <div className="h-2 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>

              {/* Brazos: 60% */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">Tríceps & Bíceps (Brazos)</span>
                  <span className="text-[11px] font-mono font-black text-yellow-400">60% • Síntesis Activa</span>
                </div>
                <div className="h-2 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              {/* Piernas & Core: 100% */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">Piernas & Core (Sentadilla & PM)</span>
                  <span className="text-[11px] font-mono font-black text-emerald-400">100% • Fresco & Listo</span>
                </div>
                <div className="h-2 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Ficha Comparativa Ayer vs Hoy */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#1A1B20] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E909A]">
                  Ayer: Ejercicio
                </span>
                <div className="text-xl font-extrabold text-white">
                  6.420 <span className="text-xs text-[#8E909A] font-normal">kg</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block pt-1">
                  Sobrecarga completada
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#1A1B20] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E909A]">
                  Hoy: Descanso
                </span>
                <div className="text-xl font-extrabold text-emerald-400">
                  Síntesis
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block pt-1">
                  +50 XP Racha blindada
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VISTA: Técnica & Guía RIR */}
      {activeSegment === 'technique' && (
        <div className="space-y-4 animate-fadeIn">
          <ExerciseTechniqueView
            onStartExerciseRoutine={() => {
              onStartWorkout(0)
            }}
          />
          <RirGuideView />
        </div>
      )}
    </div>
  )
}
