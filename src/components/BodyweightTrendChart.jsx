import React, { useState } from 'react'
import { TrendingUp, Scale, Target, Calendar } from 'lucide-react'

export function BodyweightTrendChart({
  measurements = [],
  targetWeight = 80.0
}) {
  const [selectedPointIndex, setSelectedPointIndex] = useState(null)

  // Ordenar de más antiguo a más reciente
  const sorted = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 text-center border border-sand-200">
        <Scale className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-carbon-900">Sin registros de peso</h4>
        <p className="text-xs text-neutral-400 mt-1">
          Registra tus pesajes en ayunas para ver la curva de tendencia.
        </p>
      </div>
    )
  }

  // Dimensiones del SVG
  const width = 340
  const height = 160
  const paddingX = 35
  const paddingTop = 25
  const paddingBottom = 30

  const weights = sorted.map((p) => Number(p.weight))
  const minW = Math.max(0, Math.floor(Math.min(...weights) - 1.5))
  const maxW = Math.ceil(Math.max(...weights, targetWeight) + 1.5)
  const rangeW = maxW - minW || 5

  const getX = (idx) => {
    if (sorted.length === 1) return width / 2
    return paddingX + (idx / (sorted.length - 1)) * (width - paddingX * 2)
  }

  const getY = (w) => {
    return height - paddingBottom - ((w - minW) / rangeW) * (height - paddingTop - paddingBottom)
  }

  const polylineCoords = sorted.map((p, idx) => `${getX(idx)},${getY(p.weight)}`).join(' ')
  const areaCoords = `${getX(0)},${height - paddingBottom} ${polylineCoords} ${getX(
    sorted.length - 1
  )},${height - paddingBottom}`

  const targetY = getY(targetWeight)

  const activePoint =
    selectedPointIndex !== null ? sorted[selectedPointIndex] : sorted[sorted.length - 1]

  const firstWeight = sorted[0]?.weight || 0
  const latestWeight = sorted[sorted.length - 1]?.weight || 0
  const totalDelta = Math.round((latestWeight - firstWeight) * 10) / 10

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
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            TENDENCIA DE PESO CORPORAL
          </span>
          <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
            Evolución de Masa
          </h3>
        </div>

        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
            totalDelta >= 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-sand-100 text-neutral-700'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            {totalDelta >= 0 ? '+' : ''}
            {totalDelta} kg total
          </span>
        </div>
      </div>

      {/* Métricas: Actual, Inicial, Meta */}
      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-sand-50 border border-sand-200/60 text-center">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 uppercase">Actual</span>
          <div className="text-sm font-black text-carbon-900 mt-0.5">
            {latestWeight} <span className="text-[10px] font-semibold text-neutral-500">kg</span>
          </div>
        </div>
        <div>
          <span className="text-[9px] font-bold text-neutral-400 uppercase">Punto Inicio</span>
          <div className="text-sm font-black text-neutral-600 mt-0.5">
            {firstWeight} <span className="text-[10px] font-semibold text-neutral-400">kg</span>
          </div>
        </div>
        <div>
          <span className="text-[9px] font-bold text-neutral-400 uppercase">Objetivo</span>
          <div className="text-sm font-black text-coral-500 mt-0.5">
            {targetWeight} <span className="text-[10px] font-semibold text-coral-400">kg</span>
          </div>
        </div>
      </div>

      {/* Gráfico SVG de Peso */}
      <div className="relative pt-1 pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141416" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#141416" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas de cuadrícula horizontal */}
          {[minW, minW + rangeW / 2, maxW].map((wTick, i) => {
            const y = getY(wTick)
            return (
              <g key={i}>
                <line
                  x1={paddingX - 10}
                  y1={y}
                  x2={width - paddingX + 10}
                  y2={y}
                  stroke="#E9E6DE"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 14}
                  y={y + 3}
                  textAnchor="end"
                  fill="#A3A3A3"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {Math.round(wTick * 10) / 10}k
                </text>
              </g>
            )
          })}

          {/* Línea de meta de peso */}
          {targetWeight >= minW && targetWeight <= maxW && (
            <g>
              <line
                x1={paddingX}
                y1={targetY}
                x2={width - paddingX}
                y2={targetY}
                stroke="#FF5A36"
                strokeDasharray="4,4"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              <text
                x={width - paddingX + 5}
                y={targetY + 2.5}
                fill="#FF5A36"
                fontSize="7.5"
                fontWeight="800"
              >
                Meta
              </text>
            </g>
          )}

          {/* Relleno con gradiente */}
          {sorted.length > 1 && (
            <polygon points={areaCoords} fill="url(#weightGradient)" />
          )}

          {/* Línea principal de pesajes */}
          {sorted.length > 1 && (
            <polyline
              points={polylineCoords}
              fill="none"
              stroke="#141416"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Puntos de pesaje interactivos */}
          {sorted.map((p, idx) => {
            const cx = getX(idx)
            const cy = getY(p.weight)
            const isSelected =
              selectedPointIndex === idx ||
              (selectedPointIndex === null && idx === sorted.length - 1)

            return (
              <g
                key={p.id || idx}
                className="cursor-pointer transition-all"
                onClick={() => setSelectedPointIndex(idx)}
              >
                <circle cx={cx} cy={cy} r="14" fill="transparent" />

                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="#141416"
                    fillOpacity="0.2"
                    className="animate-pulse"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '5' : '3.5'}
                  fill={isSelected ? '#FF5A36' : '#141416'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#141416' : '#A3A3A3'}
                  fontSize="8.5"
                  fontWeight={isSelected ? '800' : '600'}
                >
                  {formatDate(p.date)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Inspector del punto seleccionado */}
      {activePoint && (
        <div className="p-3 bg-carbon-900 text-white rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
          <div>
            <div className="text-[9px] font-bold tracking-wider text-coral-500 uppercase">
              PESAJE DEL {formatDate(activePoint.date).toUpperCase()}
            </div>
            <div className="font-bold text-white text-sm mt-0.5">
              {activePoint.weight} kg
              {activePoint.bodyFatPct && (
                <span className="text-xs text-neutral-300 font-normal ml-2">
                  • {activePoint.bodyFatPct}% Grasa
                </span>
              )}
            </div>
            {activePoint.notes && (
              <div className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                {activePoint.notes}
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="text-[9px] font-bold text-neutral-400 uppercase block">Cintura</span>
            <span className="font-mono font-black text-white text-xs">
              {activePoint.waist ? `${activePoint.waist} cm` : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
