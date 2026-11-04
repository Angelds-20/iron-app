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
  Plus,
  Play,
  Calendar,
  Utensils
} from 'lucide-react'
import { getLocalDateString, getYesterdayLocalDateString } from '../lib/dateUtils'
import { ExerciseTechniqueView } from './ExerciseTechniqueView'
import { RirGuideView } from './RirGuideView'

// Componente de anillo de progreso con blanco protagonista y brillo nítido
function ProgressCircle({ number = 1, progress = 75, size = 50 }) {
  const strokeWidth = 3.5
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
          className="transition-all duration-700 ease-out drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
        />
      </svg>
      <span className="absolute text-base font-black text-white leading-none">
        {number}
      </span>
    </div>
  )
}

// Matriz de puntos de actividad con puntos blancos brillantes de alto contraste
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
        <div key={m.name} className="space-y-3">
          <span className="text-xs font-black text-white block text-center tracking-wide">
            {m.name}
          </span>
          <div className="grid grid-cols-6 gap-x-2 gap-y-2.5 justify-items-center">
            {m.dots.map((active, i) => (
              <span
                key={i}
                className={`rounded-full transition-all ${
                  active
                    ? 'w-2 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]'
                    : 'w-1.5 h-1.5 bg-[#383A44]'
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
  lastWorkout,
  bodyweight,
  onUpdateWeight,
  onOpenEvolution,
  onOpenAddMeasurement,
  currentSessionVolume,
  targetVolume = 6500,
  watchData,
  onOpenWatchModal,
  activeSession,
  onDiscardActiveSession,
  routines = [],
  onStartWorkout,
  onViewAllRoutines,
  onOpenNutrition
}) {
  const [activeSegment, setActiveSegment] = useState('workouts') // 'workouts' | 'recovery' | 'technique'

  const todayStr = getLocalDateString()
  const yesterdayStr = getYesterdayLocalDateString()

  const isTodayRest = restDates.includes(todayStr)
  const wasYesterdayTrained = completedDates.includes(yesterdayStr)

  // Nombre formateado de días para lenguaje natural
  const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const tomorrowDayName = tomorrowDate.toLocaleDateString('es-ES', { weekday: 'long' })

  // Rutina realizada ayer (Pecho + Tríceps)
  const lastRoutineTitle = lastWorkout?.title || 'Torso — Banca & Inclinado'
  const lastRoutineShort = 'Pecho + Tríceps'
  const lastVolume = lastWorkout?.totalVolume || currentSessionVolume || 6420

  // Siguiente rutina en el ciclo de sobrecarga
  const isLastTorso =
    lastWorkout?.routineId === 'torso-fuerza' ||
    lastRoutineTitle.toLowerCase().includes('torso') ||
    lastRoutineTitle.toLowerCase().includes('banca') ||
    lastRoutineTitle.toLowerCase().includes('pecho')

  const nextRoutineIndex = isLastTorso ? 1 : 0
  const nextRoutine = routines[nextRoutineIndex] || routines[1] || routines[0]

  // Contar series completadas si hay sesión activa
  const completedSetsCount = activeSession?.exerciseData
    ? Object.values(activeSession.exerciseData).flatMap((sets) => sets).filter((s) => s.completed).length
    : 0

  const displayVolume = currentSessionVolume || 6420

  return (
    <div className="space-y-4 animate-fadeIn pb-24">
      {/* Selector de Pestañas con BLANCO PROTAGONISTA en el activo */}
      <div className="flex items-center gap-2 px-1">
        <button
          type="button"
          onClick={() => setActiveSegment('workouts')}
          className={`text-xs font-black px-4 py-2 rounded-full transition-all cursor-pointer touch-press ${
            activeSegment === 'workouts'
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'text-zinc-400 hover:text-white bg-[#212227]/60'
          }`}
        >
          Workouts
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment('recovery')}
          className={`text-xs font-black px-4 py-2 rounded-full transition-all cursor-pointer touch-press ${
            activeSegment === 'recovery'
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'text-zinc-400 hover:text-white bg-[#212227]/60'
          }`}
        >
          Recuperación Muscular
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment('technique')}
          className={`text-xs font-black px-4 py-2 rounded-full transition-all cursor-pointer touch-press ${
            activeSegment === 'technique'
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'text-zinc-400 hover:text-white bg-[#212227]/60'
          }`}
        >
          Técnica & RIR
        </button>
      </div>

      {/* Banner de Orientación Diaria Inteligente */}
      {activeSession?.isActive && completedSetsCount > 0 ? (
        /* Caso 1: Sesión en Curso */
        <div className="bg-[#212227] text-white rounded-[28px] p-5 sm:p-6 shadow-xl border border-white/20 flex items-center justify-between animate-slideUp">
          <div
            onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
            className="cursor-pointer flex-1 pr-3"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" />
              <span className="text-[10px] font-black tracking-widest uppercase text-white">
                SESIÓN EN CURSO
              </span>
            </div>
            <h3 className="text-lg font-black text-white leading-tight">
              {routines[activeSession.routineIndex]?.title || 'Torso — Banca & Inclinado'}
            </h3>
            <p className="text-xs text-zinc-300 mt-1 font-medium">
              {completedSetsCount} series completadas • Toca para continuar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStartWorkout(activeSession.routineIndex || 0)}
              className="px-4 py-2.5 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer touch-press shadow-lg shadow-white/20"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5 text-black stroke-[3]" />
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
                className="p-2.5 rounded-xl bg-[#2C2D34] text-zinc-400 hover:text-rose-400 transition-colors touch-press cursor-pointer"
                title="Descartar sesión no guardada"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : isTodayRest ? (
        /* Caso 2: Hoy toca DESCANSO ACTIVO & RECUPERACIÓN */
        <div className="bg-[#212227] text-white rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34] space-y-4 animate-fadeIn">
          {/* Header del Banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-white/90">
                HOY • DESCANSO ACTIVO & RECUPERACIÓN
              </span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-[#1A1B20] px-2.5 py-1 rounded-full border border-[#2C2D34]">
              Racha protegida • +50 XP
            </span>
          </div>

          {/* Título & Contexto de lo que hiciste ayer */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Regenerando Pectoral & Tríceps
            </h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              <span className="text-white font-semibold">Ayer completaste:</span>{' '}
              <strong className="text-white">{lastRoutineShort}</strong> con{' '}
              <strong className="text-white">{lastVolume.toLocaleString()} kg</strong> levantados en 15 series con barra de 60 kg.
              Hoy tus fibras musculares se reparan y crecen.
            </p>
          </div>

          {/* Tarjeta de Próximo Paso (Mañana) */}
          <div className="p-3.5 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2C2D34] flex items-center justify-center text-white font-black text-sm">
                2
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                  SIGUIENTE SESIÓN • MAÑANA {tomorrowDayName.toUpperCase()}
                </span>
                <div className="text-sm font-black text-white leading-tight mt-0.5">
                  {nextRoutine.title}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Sentadilla 60 kg • Peso Muerto 60 kg • Gemelos con Barra
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveSegment('recovery')}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-200 text-black text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-white/20 transition-transform active:scale-[0.98] cursor-pointer touch-press"
            >
              <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Ver Recuperación Muscular</span>
            </button>

            <button
              type="button"
              onClick={() => onStartWorkout(nextRoutineIndex)}
              className="py-3.5 px-4 rounded-2xl bg-[#1A1B20] hover:bg-[#2C2D34] text-zinc-300 hover:text-white text-xs font-bold transition-colors cursor-pointer touch-press border border-[#2C2D34]"
              title="Adelantar entrenamiento de mañana para hoy"
            >
              <span>Entrenar Pierna Hoy</span>
            </button>
          </div>
        </div>
      ) : (
        /* Caso 3: Hoy toca ENTRENAR */
        <div className="bg-[#212227] text-white rounded-[28px] p-5 sm:p-6 shadow-xl border border-white/20 space-y-4 animate-fadeIn">
          {/* Header del Banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" />
              <span className="text-[10px] font-black tracking-widest uppercase text-white">
                HOY TOCA ENTRENAR
              </span>
            </div>
            <span className="text-[10px] font-black text-black bg-white px-2.5 py-0.5 rounded-full uppercase">
              Listo para sobrecarga
            </span>
          </div>

          {/* Título Principal */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Hoy toca: {nextRoutine.title}
            </h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              <span className="text-white font-semibold">Ayer:</span>{' '}
              {wasYesterdayTrained ? (
                <>Completaste <strong className="text-white">{lastRoutineShort}</strong> ({lastVolume.toLocaleString()} kg). Hoy cambiamos a tren inferior.</>
              ) : (
                <>Completaste <strong className="text-white">Descanso Activo</strong>. Tu sistema neuromuscular está al 100% para mover los 60 kg.</>
              )}
            </p>
          </div>

          {/* Resumen de la Rutina de Hoy */}
          <div className="p-3.5 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm">
                {nextRoutineIndex + 1}
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                  {nextRoutine.estimatedTime || '45 min'} • {nextRoutine.intensity || 'Alta Intensidad'}
                </span>
                <div className="text-xs font-bold text-white mt-0.5">
                  Sentadilla 60 kg • Peso Muerto 60 kg • Gemelos con Barra
                </div>
              </div>
            </div>
          </div>

          {/* Botón Masivo Blanco Protagonista */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onStartWorkout(nextRoutineIndex)}
              className="flex-1 py-4 px-5 rounded-2xl bg-white hover:bg-zinc-200 text-black text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-white/20 transition-transform active:scale-[0.98] cursor-pointer touch-press"
            >
              <Play className="w-4 h-4 text-black fill-black" />
              <span>Iniciar Rutina de Hoy</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
            </button>

            {onLogRestDay && (
              <button
                type="button"
                onClick={onLogRestDay}
                className="py-3 px-4 rounded-2xl bg-[#1A1B20] hover:bg-[#2C2D34] text-zinc-400 hover:text-white text-xs font-bold border border-[#2C2D34] transition-colors cursor-pointer touch-press"
                title="Tomar día de descanso hoy"
              >
                <span>Descansar Hoy</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. VISTA: WORKOUTS (Con Blanco Protagonista de Alto Contraste) */}
      {activeSegment === 'workouts' && (
        <div className="space-y-3.5">
          {/* Fila 1: Dos Tarjetas con Blanco Brillante */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Tarjeta 1 (Izquierda): Rutina 1 (Chest + tricep) */}
            <div
              onClick={() => onStartWorkout(0)}
              className="rounded-[28px] bg-[#212227] p-5 sm:p-6 flex flex-col justify-between min-h-[175px] transition-transform active:scale-[0.98] cursor-pointer group shadow-xl"
            >
              <div className="flex items-start justify-between">
                <ProgressCircle number={1} progress={75} size={50} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewAllRoutines && onViewAllRoutines()
                  }}
                  className="text-zinc-400 group-hover:text-white transition-colors p-1"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-black text-white leading-tight">
                  Chest + tricep
                </h3>
                <p className="text-xs text-zinc-300 font-semibold mt-1">
                  Ayer • 60kg listo
                </p>
              </div>
            </div>

            {/* Tarjeta 2 (Derecha): Body weight con Número Blanco Masivo y Edición Directa */}
            <div
              onClick={() => (onOpenAddMeasurement ? onOpenAddMeasurement() : onOpenEvolution())}
              className="rounded-[28px] bg-[#212227] p-5 sm:p-6 flex flex-col justify-between min-h-[175px] transition-transform active:scale-[0.98] cursor-pointer group shadow-xl border border-transparent hover:border-[#2C2D34]"
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
                  {Math.round(bodyweight || 120)}
                  <span className="text-lg font-bold text-white/80 ml-1">kg</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onOpenAddMeasurement) onOpenAddMeasurement()
                    else if (onOpenEvolution) onOpenEvolution()
                  }}
                  className="p-1.5 rounded-xl bg-[#2C2D34] text-zinc-300 group-hover:text-white transition-colors"
                  title="Editar peso y medidas"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-white leading-tight">
                    Body weight
                  </h3>
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-colors">
                    • Editar
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-semibold mt-1">
                  Hoy en ayunas
                </p>
              </div>
            </div>
          </div>

          {/* Fila 2: Tarjeta Central con Matriz de Puntos Blancos y Rutina 2 */}
          <div className="rounded-[28px] bg-[#212227] p-6 space-y-5 shadow-xl">
            {/* Matriz de Puntos de Actividad Jan / Feb / Mar */}
            <DotMatrixHeatmap />

            {/* Sección Inferior: Rutina 2 (Back + bicep + legs) */}
            <div
              onClick={() => onStartWorkout(1)}
              className="pt-4 border-t border-[#2C2D34] flex items-center justify-between cursor-pointer group transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <ProgressCircle number={2} progress={35} size={46} />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                    Back + bicep + legs
                  </h3>
                  <p className="text-xs text-zinc-300 font-semibold mt-1 truncate">
                    Mondays • Pierna & PM
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-zinc-400 group-hover:text-white transition-colors p-2 flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fila 3: Tarjeta Horizontal de Volumen Levantado */}
          <div
            onClick={onOpenEvolution}
            className="rounded-[24px] bg-[#212227] p-5 sm:p-6 flex items-center justify-between transition-transform active:scale-[0.99] cursor-pointer group shadow-xl"
          >
            <div>
              <h4 className="text-base font-black text-white leading-tight">
                Volume lifted
              </h4>
              <p className="text-xs text-zinc-300 font-semibold mt-0.5">
                Last 7 days • 15 series
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
                {displayVolume.toLocaleString()}
                <span className="text-sm font-bold text-white/80 ml-1">kg</span>
              </span>
              <SlidersHorizontal className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors ml-3.5" />
            </div>
          </div>

          {/* Fila: Tarjeta Rápida de Nutrición & Macros Cero Fricción */}
          {onOpenNutrition && (
            <div
              onClick={onOpenNutrition}
              className="rounded-[24px] bg-[#212227] hover:bg-[#28292F] p-5 sm:p-6 flex items-center justify-between transition-all cursor-pointer group shadow-xl border border-transparent hover:border-[#2C2D34]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white leading-tight">
                    Dieta & Macros
                  </h4>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                    Cero Fricción • Bloques rápidos de comida
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-xs font-black text-white">
                    6 bloques
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-medium">
                    Toca para sumar
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          )}

          {/* Fila 4: Tarjeta de Añadir Rutina con Botón Blanco Protagonista */}
          <div
            onClick={() => (onViewAllRoutines ? onViewAllRoutines() : onStartWorkout(0))}
            className="rounded-[28px] bg-[#212227] p-6 flex items-center justify-center transition-all cursor-pointer active:scale-[0.98] shadow-xl group hover:bg-[#272830]"
            title="Añadir nuevo entrenamiento o rutina"
          >
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/20 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
        </div>
      )}

      {/* 2. VISTA: Recuperación Muscular (Con Blanco Protagonista) */}
      {activeSegment === 'recovery' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="rounded-[28px] bg-[#212227] p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 w-max mb-2 shadow-md shadow-white/10">
                  <Moon className="w-3.5 h-3.5 text-black" />
                  <span>HOY: DESCANSO ACTIVO</span>
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">
                  Recuperación Muscular
                </h2>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-white/20">
                <ShieldCheck className="w-6 h-6 text-black stroke-[2.5]" />
              </div>
            </div>

            {/* Dashboard Visual de Recuperación con Barras Vibrantes */}
            <div className="space-y-4 bg-[#1A1B20] p-5 rounded-2xl">
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest block">
                ESTADO POR GRUPO MUSCULAR
              </span>

              {/* Pecho: 45% */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Pectoral (Banca & Inclinado)</span>
                  <span className="text-xs font-mono font-black text-white">45% • Reparando</span>
                </div>
                <div className="h-2.5 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{ width: '45%' }}
                  />
                </div>
              </div>

              {/* Espalda: 55% */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Dorsales & Espalda (Remo)</span>
                  <span className="text-xs font-mono font-black text-white">55% • Supercompensando</span>
                </div>
                <div className="h-2.5 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{ width: '55%' }}
                  />
                </div>
              </div>

              {/* Brazos: 60% */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Tríceps & Bíceps (Brazos)</span>
                  <span className="text-xs font-mono font-black text-white">60% • Síntesis Activa</span>
                </div>
                <div className="h-2.5 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              {/* Piernas & Core: 100% */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Piernas & Core (Sentadilla & PM)</span>
                  <span className="text-xs font-mono font-black text-white">100% • Fresco & Listo</span>
                </div>
                <div className="h-2.5 w-full bg-[#2C2D34] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Ficha Comparativa Ayer vs Hoy */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#1A1B20] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Ayer: Ejercicio
                </span>
                <div className="text-2xl font-black text-white">
                  6.420 <span className="text-xs text-white/70 font-normal">kg</span>
                </div>
                <span className="text-[11px] text-white font-bold block pt-1">
                  15 series completadas
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#1A1B20] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Hoy: Descanso
                </span>
                <div className="text-2xl font-black text-white">
                  Síntesis
                </div>
                <span className="text-[11px] text-white font-bold block pt-1">
                  +50 XP Racha protegida
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
