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
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Selector Principal de Vista: Fuerza & Cargas vs Físico & Medidas */}
      <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-full border border-sand-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => handleSubTabChange('strength')}
          className={`py-2 text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            currentSubTab === 'strength'
              ? 'bg-carbon-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-carbon-900'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-coral-500" />
          <span>Fuerza & Cargas</span>
        </button>

        <button
          type="button"
          onClick={() => handleSubTabChange('body')}
          className={`py-2 text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            currentSubTab === 'body'
              ? 'bg-carbon-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-carbon-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-coral-500" />
          <span>Físico & Medidas</span>
        </button>
      </div>

      {/* VISTA 1: FUERZA Y SOBRECARGA */}
      {currentSubTab === 'strength' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Encabezado */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                MÉTRICAS & SOBRECARGA
              </span>
              <h2 className="text-xl font-black text-carbon-900 leading-tight">
                Estadísticas de Fuerza
              </h2>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-100 border border-sand-200/80 text-xs font-bold text-carbon-900">
              <Activity className="w-3.5 h-3.5 text-coral-500" />
              <span>{workoutsHistory.length} Entrenamientos</span>
            </div>
          </div>

          {/* Selector de Ejercicio para la Curva de Progresión */}
          <div>
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                SELECCIONAR EJERCICIO
              </span>
              <span className="text-[10px] font-bold text-neutral-400">
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
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-carbon-900 text-white shadow-xs'
                        : 'bg-white text-neutral-500 hover:text-carbon-900 border border-sand-200/80'
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
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-sand-100 flex items-center justify-center text-coral-500">
                  <Watch className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                    BIOMETRÍA CARDÍACA
                  </span>
                  <h3 className="text-base font-black text-carbon-900 leading-tight">
                    Honor Choice Watch 2i
                  </h3>
                </div>
              </div>

              {onOpenWatchSync && (
                <button
                  type="button"
                  onClick={onOpenWatchSync}
                  className="text-xs font-bold text-coral-500 hover:text-coral-600 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ajustar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 bg-sand-50 rounded-2xl border border-sand-200/60">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Promedio</span>
                <div className="text-base font-black text-carbon-900 mt-0.5 font-mono">
                  {watchData?.avgBpm || 132} <span className="text-[10px] font-bold text-neutral-400">BPM</span>
                </div>
              </div>
              <div className="p-2.5 bg-sand-50 rounded-2xl border border-sand-200/60">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Pico Máx</span>
                <div className="text-base font-black text-coral-500 mt-0.5 font-mono">
                  {watchData?.maxBpm || 165} <span className="text-[10px] font-bold text-coral-400">BPM</span>
                </div>
              </div>
              <div className="p-2.5 bg-sand-50 rounded-2xl border border-sand-200/60">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Calorías</span>
                <div className="text-base font-black text-carbon-900 mt-0.5 font-mono">
                  {watchData?.caloriesBurned || 260} <span className="text-[10px] font-bold text-neutral-400">kcal</span>
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
