import React from 'react'
import {
  Scale,
  Ruler,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  Activity,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { BodyweightTrendChart } from './BodyweightTrendChart'
import {
  calculateWaistToHeightRatio,
  calculateChestToWaistRatio,
  calculateMassBreakdown
} from '../lib/bodyMetricsEngine'

export function BodyEvolutionView({
  measurements = [],
  onOpenAddModal,
  onDeleteMeasurement
}) {
  const sorted = [...measurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const latest = sorted[0] || {}
  const oldest = sorted[sorted.length - 1] || {}

  const currentWeight = Number(latest.weight) || 77.9
  const currentBodyFat = latest.bodyFatPct || 16.2
  const massBreakdown = calculateMassBreakdown(currentWeight, currentBodyFat)

  const waistRatio = calculateWaistToHeightRatio(latest.waist || 83, latest.height || 175)
  const vTaper = calculateChestToWaistRatio(latest.chest || 104, latest.waist || 83)

  // Deltas de medidas (actual vs primera medición)
  const getDelta = (curr, init) => {
    if (!curr || !init) return null
    const diff = Math.round((Number(curr) - Number(init)) * 10) / 10
    return diff
  }

  const waistDelta = getDelta(latest.waist, oldest.waist)
  const chestDelta = getDelta(latest.chest, oldest.chest)
  const armDelta = getDelta(latest.arm, oldest.arm)
  const thighDelta = getDelta(latest.thigh, oldest.thigh)

  const formatDate = (dateStr) => {
    try {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2])
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      }
      return dateStr
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Encabezado y Acción */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            COMPOSICIÓN & MEDIDAS
          </span>
          <h2 className="text-xl font-black text-carbon-900 leading-tight">
            Evolución Física
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-3.5 py-2 bg-carbon-900 hover:bg-black text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-coral-500" />
          <span>Registrar Medida</span>
        </button>
      </div>

      {/* Tarjeta de Resumen Antropométrico Principal */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 text-center">
          <span className="text-[9px] font-bold text-neutral-400 uppercase">Peso Actual</span>
          <div className="text-xl font-black text-carbon-900 mt-1 font-mono">
            {currentWeight} <span className="text-xs font-bold text-neutral-400">kg</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">
            Ayunas
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 text-center">
          <span className="text-[9px] font-bold text-neutral-400 uppercase">% Grasa Est.</span>
          <div className="text-xl font-black text-coral-500 mt-1 font-mono">
            {currentBodyFat}%
          </div>
          <span className="text-[9px] font-bold text-neutral-400 block mt-0.5">
            US Navy
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-xs border border-sand-200/80 text-center">
          <span className="text-[9px] font-bold text-neutral-400 uppercase">V-Taper</span>
          <div className="text-xl font-black text-carbon-900 mt-1 font-mono">
            {vTaper?.ratio || 1.25}
          </div>
          <span className="text-[9px] font-bold text-coral-500 block mt-0.5">
            {vTaper?.label || 'Marcado'}
          </span>
        </div>
      </div>

      {/* 1. Gráfico de Tendencia de Peso */}
      <BodyweightTrendChart measurements={measurements} targetWeight={80.0} />

      {/* 2. Medidas Antropométricas Actuales vs Iniciales */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              PERÍMETROS CLAVE
            </span>
            <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
              Adaptación Muscular
            </h3>
          </div>

          <span className="text-[10px] font-black text-neutral-400 bg-sand-100 px-2.5 py-1 rounded-full uppercase">
            Progreso Neto
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Pecho */}
          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Pecho</span>
              {chestDelta !== null && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +{chestDelta} cm
                </span>
              )}
            </div>
            <div className="text-lg font-black text-carbon-900 mt-1 font-mono">
              {latest.chest || 104} <span className="text-xs font-semibold text-neutral-400">cm</span>
            </div>
            <span className="text-[9px] text-neutral-400 font-medium">
              Base: {oldest.chest || 100.5} cm
            </span>
          </div>

          {/* Brazo */}
          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Brazo</span>
              {armDelta !== null && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +{armDelta} cm
                </span>
              )}
            </div>
            <div className="text-lg font-black text-carbon-900 mt-1 font-mono">
              {latest.arm || 38} <span className="text-xs font-semibold text-neutral-400">cm</span>
            </div>
            <span className="text-[9px] text-neutral-400 font-medium">
              Base: {oldest.arm || 36.5} cm
            </span>
          </div>

          {/* Cintura */}
          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Cintura</span>
              {waistDelta !== null && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  {waistDelta <= 0 ? `${waistDelta} cm` : `+${waistDelta} cm`}
                </span>
              )}
            </div>
            <div className="text-lg font-black text-carbon-900 mt-1 font-mono">
              {latest.waist || 83} <span className="text-xs font-semibold text-neutral-400">cm</span>
            </div>
            <span className="text-[9px] text-neutral-400 font-medium">
              Base: {oldest.waist || 84.5} cm
            </span>
          </div>

          {/* Muslo */}
          <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Muslo</span>
              {thighDelta !== null && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +{thighDelta} cm
                </span>
              )}
            </div>
            <div className="text-lg font-black text-carbon-900 mt-1 font-mono">
              {latest.thigh || 58.5} <span className="text-xs font-semibold text-neutral-400">cm</span>
            </div>
            <span className="text-[9px] text-neutral-400 font-medium">
              Base: {oldest.thigh || 56.5} cm
            </span>
          </div>
        </div>
      </div>

      {/* 3. Desglose de Masa Magra vs Grasa */}
      {massBreakdown && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              DISTRIBUCIÓN DE TEJIDO
            </span>
            <span className="text-xs font-bold text-neutral-500">
              {currentWeight} kg totales
            </span>
          </div>

          {/* Barra proporcional de masa magra vs grasa */}
          <div className="w-full h-3 rounded-full bg-sand-100 overflow-hidden flex gap-0.5 p-0.5">
            <div
              style={{ width: `${100 - currentBodyFat}%` }}
              className="h-full rounded-sm bg-carbon-900"
              title={`Masa Magra: ${massBreakdown.leanKg} kg`}
            />
            <div
              style={{ width: `${currentBodyFat}%` }}
              className="h-full rounded-sm bg-coral-500"
              title={`Masa Grasa: ${massBreakdown.fatKg} kg`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-carbon-900" />
              <span className="font-bold text-carbon-900">
                Masa Magra: {massBreakdown.leanKg} kg
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-500" />
              <span className="font-bold text-coral-600">
                Masa Grasa: {massBreakdown.fatKg} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Historial Cronológico de Check-ins */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              HISTORIAL DE REGISTROS
            </span>
            <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
              Check-ins ({sorted.length})
            </h3>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-sand-50 rounded-2xl border border-sand-200/60 flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-carbon-900 font-mono">
                    {item.weight} kg
                  </span>
                  {item.bodyFatPct && (
                    <span className="text-[10px] font-bold text-coral-500 bg-coral-50 px-1.5 py-0.5 rounded-md">
                      {item.bodyFatPct}% Grasa
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {formatDate(item.date)}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Cintura: {item.waist ? `${item.waist}cm` : '—'} • Pecho: {item.chest ? `${item.chest}cm` : '—'} • Brazo: {item.arm ? `${item.arm}cm` : '—'}
                </div>
                {item.notes && (
                  <div className="text-[9px] text-neutral-400 italic mt-0.5">
                    {item.notes}
                  </div>
                )}
              </div>

              {sorted.length > 1 && onDeleteMeasurement && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Eliminar este registro de peso?')) {
                      onDeleteMeasurement(item.id)
                    }
                  }}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
