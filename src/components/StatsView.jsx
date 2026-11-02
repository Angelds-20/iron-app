import React, { useState, useMemo, useEffect } from 'react'
import {
  TrendingUp,
  BarChart3,
  Flame,
  Watch,
  Award,
  Layers,
  Calendar,
  Activity,
  ArrowRight,
  ShieldCheck,
  Scale,
  Dumbbell
} from 'lucide-react'
import { ProgressionChart } from './ProgressionChart'
import { WeeklyVolumeChart } from './WeeklyVolumeChart'
import { MuscleDistributionCard } from './MuscleDistributionCard'
import { SessionComparisonCard } from './SessionComparisonCard'
import { PRBoardCard } from './PRBoardCard'
import { BodyEvolutionView } from './BodyEvolutionView'
import {
  getExerciseListFromHistory,
  getExerciseProgression,
  getWeeklyVolumeData,
  getMuscleDistribution,
  compareLastTwoSessions,
  getAuditedPersonalRecords
} from '../lib/statsEngine'

export function StatsView({
  workoutsHistory = [],
  personalRecords = {},
  watchData = {},
  onOpenWatchSync,
  bodyMeasurements = [],
  onOpenAddMeasurement,
  onDeleteMeasurement,
  activeSubTab = 'strength',
  onSelectSubTab
}) {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab)
  const [selectedExerciseId, setSelectedExerciseId] = useState('bench-press')

  useEffect(() => {
    if (activeSubTab) {
      setCurrentSubTab(activeSubTab)
    }
  }, [activeSubTab])

  const handleSubTabChange = (tab) => {
    setCurrentSubTab(tab)
    if (onSelectSubTab) onSelectSubTab(tab)
  }

  // Lista de ejercicios presentes en el historial
  const availableExercises = useMemo(
    () => getExerciseListFromHistory(workoutsHistory),
    [workoutsHistory]
  )

  // Datos de progresión del ejercicio seleccionado
  const progressionData = useMemo(
    () => getExerciseProgression(selectedExerciseId, workoutsHistory),
    [selectedExerciseId, workoutsHistory]
  )

  const selectedExerciseObj =
    availableExercises.find((e) => e.id === selectedExerciseId) || availableExercises[0]

  // Volumen Semanal
  const volumeData = useMemo(
    () => getWeeklyVolumeData(workoutsHistory),
    [workoutsHistory]
  )

  // Distribución por Grupo Muscular
  const distributionData = useMemo(
    () => getMuscleDistribution(workoutsHistory),
    [workoutsHistory]
  )

  // Comparativa de Sesiones
  const comparisonData = useMemo(
    () => compareLastTwoSessions(workoutsHistory),
    [workoutsHistory]
  )

  // Récords Personales Auditados
  const auditedPRs = useMemo(
    () => getAuditedPersonalRecords(workoutsHistory, personalRecords),
    [workoutsHistory, personalRecords]
  )

  return (
    <div className="space-y-4 pb-28 animate-fadeIn text-white">
      {/* Selector Principal de Vista: Fuerza & Cargas vs Físico & Medidas */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#212227] p-1.5 rounded-full border border-[#2C2D34] shadow-xl">
        <button
          type="button"
          onClick={() => handleSubTabChange('strength')}
          className={`py-2.5 text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-press ${
            currentSubTab === 'strength'
              ? 'bg-white text-black shadow-lg font-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Fuerza & Cargas</span>
        </button>

        <button
          type="button"
          onClick={() => handleSubTabChange('body')}
          className={`py-2.5 text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-press ${
            currentSubTab === 'body'
              ? 'bg-white text-black shadow-lg font-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Físico & Medidas</span>
        </button>
      </div>

      {/* VISTA 1: FUERZA Y SOBRECARGA */}
      {currentSubTab === 'strength' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Encabezado */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                MÉTRICAS & SOBRECARGA
              </span>
              <h2 className="text-xl font-black text-white leading-tight">
                Estadísticas de Fuerza
              </h2>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#212227] border border-[#2C2D34] text-xs font-bold text-white shadow-sm">
              <Activity className="w-3.5 h-3.5 text-white" />
              <span>{workoutsHistory.length} Entrenamientos</span>
            </div>
          </div>

          {/* Selector de Ejercicio para la Curva de Progresión */}
          <div>
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                SELECCIONAR EJERCICIO
              </span>
              <span className="text-[10px] font-bold text-zinc-400">
                {availableExercises.length} ejercicios
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {availableExercises.map((ex) => {
                const isSelected = selectedExerciseId === ex.id
                return (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer touch-press ${
                      isSelected
                        ? 'bg-white text-black font-black shadow-md'
                        : 'bg-[#1A1B20] text-zinc-400 hover:text-white border border-[#2C2D34]'
                    }`}
                  >
                    {ex.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 1. Curva de Sobrecarga y 1RM Estimado */}
          <ProgressionChart
            progressionData={progressionData}
            exerciseName={selectedExerciseObj?.name || 'Press de banca plano'}
          />

          {/* 2. Comparativa Directa entre Sesiones */}
          <SessionComparisonCard comparison={comparisonData} />

          {/* 3. Volumen Semanal y Frecuencia */}
          <div className="grid grid-cols-1 gap-4">
            <WeeklyVolumeChart volumeData={volumeData} />
            <MuscleDistributionCard distributionData={distributionData} />
          </div>

          {/* 4. Muro de Récords Personales (PRs) */}
          <PRBoardCard personalRecordsList={auditedPRs} />

          {/* 5. Biometría de Honor Choice Watch 2i */}
          <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34]/40 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center text-white">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                    BIOMETRÍA CARDÍACA
                  </span>
                  <h3 className="text-base font-black text-white leading-tight">
                    Honor Choice Watch 2i
                  </h3>
                </div>
              </div>

              {onOpenWatchSync && (
                <button
                  type="button"
                  onClick={onOpenWatchSync}
                  className="text-xs font-bold text-white hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ajustar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34]">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Promedio</span>
                <div className="text-base font-black text-white mt-0.5">
                  {watchData?.avgBpm || 132} <span className="text-[10px] font-bold text-zinc-400">BPM</span>
                </div>
              </div>
              <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34]">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Pico Máx</span>
                <div className="text-base font-black text-amber-400 mt-0.5">
                  {watchData?.maxBpm || 165} <span className="text-[10px] font-bold text-amber-400/80">BPM</span>
                </div>
              </div>
              <div className="p-3 bg-[#1A1B20] rounded-2xl border border-[#2C2D34]">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Calorías</span>
                <div className="text-base font-black text-white mt-0.5">
                  {watchData?.caloriesBurned || 260} <span className="text-[10px] font-bold text-zinc-400">kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: EVOLUCIÓN FÍSICA Y MEDIDAS */}
      {currentSubTab === 'body' && (
        <BodyEvolutionView
          measurements={bodyMeasurements}
          onOpenAddModal={onOpenAddMeasurement}
          onDeleteMeasurement={onDeleteMeasurement}
        />
      )}
    </div>
  )
}
