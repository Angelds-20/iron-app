import React from 'react'
import { ArrowUpRight, ArrowDownRight, Dumbbell, Clock, Flame, ShieldCheck, Heart } from 'lucide-react'

export function SessionComparisonCard({ comparison }) {
  if (!comparison || !comparison.hasComparison) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80">
        <div className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
          COMPARATIVA DE SESIONES
        </div>
        <h3 className="text-base font-black text-carbon-900 mt-0.5">
          Sesión de Base Registrada
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {comparison?.summary || 'Completa tu siguiente entrenamiento para comparar volumen y sobrecarga.'}
        </p>
      </div>
    )
  }

  const { current, previous, volumeDiff, weightDiff, setsDiff, isOverloadAchieved } = comparison

  const formatDate = (isoStr) => {
    if (!isoStr) return 'Reciente'
    return new Date(isoStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            AUDITORÍA DE SOBRECARGA
          </span>
          <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
            Último Entreno vs Anterior
          </h3>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
            isOverloadAchieved
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-sand-100 text-neutral-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isOverloadAchieved ? 'Sobrecarga Lograda' : 'Consolidación'}</span>
        </span>
      </div>

      {/* Tabla Comparativa de Dos Columnas */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Sesión Anterior */}
        <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 space-y-1.5">
          <div className="text-[9px] font-black tracking-wider text-neutral-400 uppercase">
            ANTERIOR ({formatDate(previous.completedAt)})
          </div>
          <div className="text-xs font-bold text-carbon-900 truncate">
            {previous.title}
          </div>
          <div className="space-y-0.5 pt-1 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Volumen:</span>
              <span className="font-bold text-carbon-900 font-mono">
                {previous.totalVolume?.toLocaleString()} kg
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Carga máx:</span>
              <span className="font-bold text-carbon-900 font-mono">
                {previous.maxWeight} kg
              </span>
            </div>
            {previous.watchMetrics?.avgBpm && (
              <div className="flex justify-between text-neutral-500">
                <span>Pulso:</span>
                <span className="font-bold text-carbon-900 font-mono">
                  {previous.watchMetrics.avgBpm} BPM
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sesión Actual */}
        <div className="p-3 rounded-2xl bg-carbon-900 text-white space-y-1.5 relative overflow-hidden shadow-xs">
          <div className="text-[9px] font-black tracking-wider text-coral-500 uppercase">
            ACTUAL ({formatDate(current.completedAt)})
          </div>
          <div className="text-xs font-bold text-white truncate">
            {current.title}
          </div>
          <div className="space-y-0.5 pt-1 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span>Volumen:</span>
              <span className="font-bold text-white font-mono flex items-center gap-0.5">
                {current.totalVolume?.toLocaleString()} kg
                {volumeDiff > 0 && (
                  <span className="text-[10px] text-coral-400 font-bold">
                    (+{volumeDiff})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Carga máx:</span>
              <span className="font-bold text-white font-mono flex items-center gap-0.5">
                {current.maxWeight} kg
                {weightDiff > 0 && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    (+{weightDiff})
                  </span>
                )}
              </span>
            </div>
            {current.watchMetrics?.avgBpm && (
              <div className="flex justify-between text-neutral-300">
                <span>Pulso:</span>
                <span className="font-bold text-white font-mono">
                  {current.watchMetrics.avgBpm} BPM
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
