import React, { useState } from 'react'
import { TrendingUp, Target, Award, Sparkles, ChevronRight } from 'lucide-react'

export function ProgressionChart({ progressionData, exerciseName = 'Press de banca plano' }) {
  const [selectedPointIndex, setSelectedPointIndex] = useState(null)

  const points = progressionData?.points || []
  if (points.length === 0) {
    return (
      <div className="bg-[#212227] rounded-[28px] p-6 text-center border border-[#2C2D34] text-white">
        <TrendingUp className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
        <h4 className="text-sm font-black text-white">Sin datos de progresión</h4>
        <p className="text-xs text-zinc-400 mt-1">
          Completa sesiones con este ejercicio para ver tu curva de sobrecarga.
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

  const weights = points.map((p) => p.maxWeight)
  const minW = Math.max(0, Math.min(...weights) - 5)
  const maxW = Math.max(...weights) + 5
  const rangeW = maxW - minW || 10

  const getX = (idx) => {
    if (points.length === 1) return width / 2
    return paddingX + (idx / (points.length - 1)) * (width - paddingX * 2)
  }

  const getY = (w) => {
    return height - paddingBottom - ((w - minW) / rangeW) * (height - paddingTop - paddingBottom)
  }

  // Generar path del área y la línea
  const polylineCoords = points.map((p, idx) => `${getX(idx)},${getY(p.maxWeight)}`).join(' ')
  const areaCoords = `${getX(0)},${height - paddingBottom} ${polylineCoords} ${getX(
    points.length - 1
  )},${height - paddingBottom}`

  const activePoint = selectedPointIndex !== null ? points[selectedPointIndex] : points[points.length - 1]

  return (
    <div className="bg-[#212227] rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#2C2D34] space-y-3.5 text-white">
      {/* Resumen del Ejercicio Seleccionado */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            CURVA DE SOBRECARGA
          </span>
          <h3 className="text-base font-black text-white leading-tight mt-0.5">
            {exerciseName}
          </h3>
        </div>

        {progressionData.weightProgress > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-black border border-white/20">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>+{progressionData.weightProgress} kg (+{progressionData.percentProgress}%)</span>
          </div>
        )}
      </div>

      {/* Tarjeta de Métricas Rápidas: Máximo, 1RM, Volumen */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] text-center">
        <div>
          <span className="text-[9px] font-black text-zinc-400 uppercase">Carga Máx</span>
          <div className="text-sm font-black text-white mt-0.5 font-mono">
            {progressionData.maxWeightAllTime} <span className="text-[10px] font-normal text-zinc-400">kg</span>
          </div>
        </div>
        <div>
          <span className="text-[9px] font-black text-zinc-400 uppercase">1RM Est.</span>
          <div className="text-sm font-black text-white mt-0.5 font-mono">
            {progressionData.max1RMAllTime} <span className="text-[10px] font-normal text-zinc-400">kg</span>
          </div>
        </div>
        <div>
          <span className="text-[9px] font-black text-zinc-400 uppercase">Sesiones</span>
          <div className="text-sm font-black text-white mt-0.5 font-mono">
            {progressionData.sessionsCount}
          </div>
        </div>
      </div>

      {/* Gráfico SVG de Progresión */}
      <div className="relative pt-1 pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="curveGradientDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
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
                  stroke="#2C2D34"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 14}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717A"
                  fontSize="8"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {Math.round(wTick)}k
                </text>
              </g>
            )
          })}

          {/* Relleno con gradiente */}
          {points.length > 1 && (
            <polygon points={areaCoords} fill="url(#curveGradientDark)" />
          )}

          {/* Línea de progresión principal blanca */}
          {points.length > 1 && (
            <polyline
              points={polylineCoords}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Puntos de datos interactivos */}
          {points.map((p, idx) => {
            const cx = getX(idx)
            const cy = getY(p.maxWeight)
            const isSelected = selectedPointIndex === idx || (selectedPointIndex === null && idx === points.length - 1)

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all"
                onClick={() => setSelectedPointIndex(idx)}
              >
                {/* Zona de toque ampliada */}
                <circle cx={cx} cy={cy} r="14" fill="transparent" />

                {/* Círculo exterior resaltado */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="#FFFFFF"
                    fillOpacity="0.3"
                    className="animate-pulse"
                  />
                )}

                {/* Círculo central */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '5' : '3.5'}
                  fill={isSelected ? '#FFFFFF' : '#121316'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                {/* Etiqueta de fecha en el eje X */}
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : '#71717A'}
                  fontSize="8.5"
                  fontWeight={isSelected ? '800' : '600'}
                >
                  {p.date}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detalle del punto seleccionado (Inspector interactivo) */}
      {activePoint && (
        <div className="p-3.5 bg-[#1A1B20] border border-[#2C2D34] text-white rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
          <div>
            <div className="text-[9px] font-black tracking-wider text-white uppercase">
              SESIÓN DEL {activePoint.date.toUpperCase()}
            </div>
            <div className="font-bold text-white text-sm mt-0.5">
              {activePoint.maxWeight} kg • 1RM {activePoint.best1RM} kg
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Mejor serie: {activePoint.bestSet.weight} kg × {activePoint.bestSet.reps} reps (RIR {activePoint.bestSet.rir})
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black text-zinc-400 uppercase block">Volumen</span>
            <span className="font-mono font-black text-white text-xs">
              {activePoint.totalVolume.toLocaleString()} kg
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
