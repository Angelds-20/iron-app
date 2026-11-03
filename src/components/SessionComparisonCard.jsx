import React from 'react'
import { ArrowUpRight, ArrowDownRight, Dumbbell, Clock, Flame, ShieldCheck, Heart } from 'lucide-react'

export function SessionComparisonCard({ comparison }) {
  if (!comparison || !comparison.hasComparison) {
    return (
      <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34] text-white">
        <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
          COMPARATIVA DE SESIONES
        </div>
        <h3 className="text-base font-black text-white mt-0.5">
          Sesión de Base Registrada
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
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
    <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34] space-y-3.5 text-white">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            AUDITORÍA DE SOBRECARGA
          </span>
          <h3 className="text-base font-black text-white leading-tight mt-0.5">
            Último Entreno vs Anterior
          </h3>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
            isOverloadAchieved
              ? 'bg-white/15 text-white border border-white/20'
              : 'bg-[#1A1B20] text-zinc-400 border border-[#2C2D34]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>{isOverloadAchieved ? 'Sobrecarga Lograda' : 'Consolidación'}</span>
        </span>
      </div>

      {/* Tabla Comparativa de Dos Columnas */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Sesión Anterior */}
        <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] space-y-1.5">
          <div className="text-[9px] font-black tracking-wider text-zinc-400 uppercase">
            ANTERIOR ({formatDate(previous.completedAt)})
          </div>
          <div className="text-xs font-bold text-white truncate">
            {previous.title}
          </div>
          <div className="space-y-0.5 pt-1 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Volumen:</span>
              <span className="font-bold text-white font-mono">
                {previous.totalVolume?.toLocaleString()} kg
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Carga máx:</span>
              <span className="font-bold text-white font-mono">
                {previous.maxWeight} kg
              </span>
            </div>
            {previous.watchMetrics?.avgBpm && (
              <div className="flex justify-between text-zinc-400">
                <span>Pulso:</span>
                <span className="font-bold text-white font-mono">
                  {previous.watchMetrics.avgBpm} BPM
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sesión Actual */}
        <div className="p-3.5 rounded-2xl bg-[#1A1B20] border border-white/30 text-white space-y-1.5 relative overflow-hidden shadow-lg">
          <div className="text-[9px] font-black tracking-wider text-white uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            ACTUAL ({formatDate(current.completedAt)})
          </div>
          <div className="text-xs font-bold text-white truncate">
            {current.title}
          </div>
          <div className="space-y-0.5 pt-1 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Volumen:</span>
              <span className="font-bold text-white font-mono flex items-center gap-0.5">
                {current.totalVolume?.toLocaleString()} kg
                {volumeDiff > 0 && (
                  <span className="text-[10px] text-white font-black">
                    (+{volumeDiff})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Carga máx:</span>
              <span className="font-bold text-white font-mono flex items-center gap-0.5">
                {current.maxWeight} kg
                {weightDiff > 0 && (
                  <span className="text-[10px] text-white font-black">
                    (+{weightDiff})
                  </span>
                )}
              </span>
            </div>
            {current.watchMetrics?.avgBpm && (
              <div className="flex justify-between text-zinc-300">
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
