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

  const currentWeight = Number(latest.weight) || 120.0
  const currentBodyFat = latest.bodyFatPct || 19.6
  const massBreakdown = calculateMassBreakdown(currentWeight, currentBodyFat)

  const waistRatio = calculateWaistToHeightRatio(latest.waist || 99, latest.height || 194)
  const vTaper = calculateChestToWaistRatio(latest.chest || 124, latest.waist || 99)

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
    <div className="space-y-4 pb-28 animate-fadeIn text-white">
      {/* Encabezado y Acción */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            COMPOSICIÓN & MEDIDAS
          </span>
          <h2 className="text-xl font-black text-white leading-tight">
            Evolución Física
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-2xl flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>Registrar Medida</span>
        </button>
      </div>

      {/* Tarjeta de Resumen Antropométrico Principal */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#212227] rounded-[24px] p-4 text-center border border-[#2C2D34]/50 shadow-xl">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
            Peso Actual
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {currentWeight} <span className="text-xs font-bold text-zinc-400">kg</span>
          </div>
          <span className="text-[9px] font-black text-emerald-400 block mt-0.5">
            Ayunas
          </span>
        </div>

        <div className="bg-[#212227] rounded-[24px] p-4 text-center border border-[#2C2D34]/50 shadow-xl">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
            % Grasa Est.
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {currentBodyFat}%
          </div>
          <span className="text-[9px] font-semibold text-zinc-400 block mt-0.5">
            US Navy
          </span>
        </div>

        <div className="bg-[#212227] rounded-[24px] p-4 text-center border border-[#2C2D34]/50 shadow-xl">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
            V-Taper
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {vTaper?.ratio || 1.25}
          </div>
          <span className="text-[9px] font-black text-amber-400 block mt-0.5">
            {vTaper?.label || 'Marcado'}
          </span>
        </div>
      </div>

      {/* 1. Gráfico de Tendencia de Peso */}
      <BodyweightTrendChart measurements={measurements} targetWeight={120.0} />

      {/* 2. Medidas Antropométricas Actuales vs Iniciales */}
      <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xl border border-[#2C2D34]/40">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              PERÍMETROS CLAVE
            </span>
            <h3 className="text-base font-black text-white leading-tight mt-0.5">
              Adaptación Muscular (194 cm / 120 kg)
            </h3>
          </div>

          <span className="text-[10px] font-black text-white bg-[#2C2D34] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Progreso Neto
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Pecho */}
          <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Pecho</span>
              {chestDelta !== null && (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1.5 py-0.5 rounded-md">
                  +{chestDelta} cm
                </span>
              )}
            </div>
            <div className="text-xl font-black text-white mt-1">
              {latest.chest || 124} <span className="text-xs font-semibold text-zinc-400">cm</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-medium">
              Base: {oldest.chest || 120} cm
            </span>
          </div>

          {/* Brazo */}
          <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Brazo</span>
              {armDelta !== null && (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1.5 py-0.5 rounded-md">
                  +{armDelta} cm
                </span>
              )}
            </div>
            <div className="text-xl font-black text-white mt-1">
              {latest.arm || 42} <span className="text-xs font-semibold text-zinc-400">cm</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-medium">
              Base: {oldest.arm || 40.5} cm
            </span>
          </div>

          {/* Cintura */}
          <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Cintura</span>
              {waistDelta !== null && (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1.5 py-0.5 rounded-md">
                  {waistDelta <= 0 ? `${waistDelta} cm` : `+${waistDelta} cm`}
                </span>
              )}
            </div>
            <div className="text-xl font-black text-white mt-1">
              {latest.waist || 99} <span className="text-xs font-semibold text-zinc-400">cm</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-medium">
              Base: {oldest.waist || 101} cm
            </span>
          </div>

          {/* Muslo */}
          <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-[#2C2D34]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Muslo</span>
              {thighDelta !== null && (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1.5 py-0.5 rounded-md">
                  +{thighDelta} cm
                </span>
              )}
            </div>
            <div className="text-xl font-black text-white mt-1">
              {latest.thigh || 68} <span className="text-xs font-semibold text-zinc-400">cm</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-medium">
              Base: {oldest.thigh || 66} cm
            </span>
          </div>
        </div>
      </div>

      {/* 3. Desglose de Masa Magra vs Grasa */}
      {massBreakdown && (
        <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 space-y-3.5 shadow-xl border border-[#2C2D34]/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              DISTRIBUCIÓN DE TEJIDO
            </span>
            <span className="text-xs font-bold text-white">
              {currentWeight} kg totales
            </span>
          </div>

          {/* Barra proporcional de masa magra vs grasa */}
          <div className="w-full h-3 rounded-full bg-[#1A1B20] overflow-hidden flex gap-1 p-0.5 border border-[#2C2D34]">
            <div
              style={{ width: `${100 - currentBodyFat}%` }}
              className="h-full rounded-sm bg-white"
              title={`Masa Magra: ${massBreakdown.leanKg} kg`}
            />
            <div
              style={{ width: `${currentBodyFat}%` }}
              className="h-full rounded-sm bg-amber-400"
              title={`Masa Grasa: ${massBreakdown.fatKg} kg`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span className="font-bold text-white">
                Masa Magra: {massBreakdown.leanKg} kg
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="font-bold text-amber-400">
                Masa Grasa: {massBreakdown.fatKg} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Historial Cronológico de Check-ins */}
      <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 space-y-3 shadow-xl border border-[#2C2D34]/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              HISTORIAL DE REGISTROS
            </span>
            <h3 className="text-base font-black text-white leading-tight mt-0.5">
              Check-ins ({sorted.length})
            </h3>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-[#1A1B20] rounded-2xl border border-[#2C2D34] flex items-center justify-between group hover:border-zinc-500 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">
                    {item.weight} kg
                  </span>
                  {item.bodyFatPct && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded-md">
                      {item.bodyFatPct}% Grasa
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-zinc-400">
                    {formatDate(item.date)}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-300 mt-1">
                  Cintura: {item.waist ? `${item.waist}cm` : '—'} • Pecho: {item.chest ? `${item.chest}cm` : '—'} • Brazo: {item.arm ? `${item.arm}cm` : '—'}
                </div>
                {item.notes && (
                  <div className="text-[9px] text-zinc-400 italic mt-0.5">
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
                  className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
