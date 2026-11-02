import React, { useState, useEffect } from 'react'
import { X, Check, Scale, Ruler, Sparkles, Activity, Plus, Minus } from 'lucide-react'
import {
  calculateBodyFatNavy,
  calculateWaistToHeightRatio,
  calculateChestToWaistRatio,
  calculateMassBreakdown
} from '../lib/bodyMetricsEngine'

export function BodyMeasurementsModal({
  isOpen,
  onClose,
  onSaveMeasurement,
  currentWeight = 120.0,
  lastEntry = null
}) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState(currentWeight)
  const [waist, setWaist] = useState(lastEntry?.waist || 99.0)
  const [chest, setChest] = useState(lastEntry?.chest || 124.0)
  const [arm, setArm] = useState(lastEntry?.arm || 42.0)
  const [thigh, setThigh] = useState(lastEntry?.thigh || 68.0)
  const [neck, setNeck] = useState(lastEntry?.neck || 44.0)
  const [height, setHeight] = useState(lastEntry?.height || 194)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0])
      setWeight(currentWeight || 120.0)
      if (lastEntry) {
        if (lastEntry.waist) setWaist(lastEntry.waist)
        if (lastEntry.chest) setChest(lastEntry.chest)
        if (lastEntry.arm) setArm(lastEntry.arm)
        if (lastEntry.thigh) setThigh(lastEntry.thigh)
        if (lastEntry.neck) setNeck(lastEntry.neck)
        if (lastEntry.height) setHeight(lastEntry.height)
      }
      setNotes('')
    }
  }, [isOpen, currentWeight, lastEntry])

  if (!isOpen) return null

  // Cálculos en vivo
  const estimatedBodyFat = calculateBodyFatNavy({ waist, neck, height })
  const waistRatio = calculateWaistToHeightRatio(waist, height)
  const vTaper = calculateChestToWaistRatio(chest, waist)
  const breakdown = estimatedBodyFat ? calculateMassBreakdown(weight, estimatedBodyFat) : null

  const handleAdjustWeight = (delta) => {
    setWeight((prev) => {
      const val = Number(prev) || 120.0
      return Math.round((val + delta) * 10) / 10
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!weight || Number(weight) <= 0) return

    const newEntry = {
      id: `meas-${Date.now()}`,
      date,
      weight: Number(weight),
      waist: waist ? Number(waist) : null,
      chest: chest ? Number(chest) : null,
      arm: arm ? Number(arm) : null,
      thigh: thigh ? Number(thigh) : null,
      neck: neck ? Number(neck) : 44,
      height: height ? Number(height) : 194,
      bodyFatPct: estimatedBodyFat,
      notes: notes.trim() || 'Pesaje matutino en ayunas.'
    }

    onSaveMeasurement(newEntry)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#212227] rounded-[28px] p-6 max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2C2D34]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2C2D34] flex items-center justify-center text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                Métricas & Medidas
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Edita tu peso corporal y perímetros
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#2C2D34] text-zinc-400 hover:text-white transition-colors cursor-pointer touch-press"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">
          {/* Peso Principal con Steppers Grandes (A prueba de dedos) */}
          <div className="p-4 rounded-2xl bg-[#1A1B20] space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block text-center">
              PESO CORPORAL ACTUAL (EN AYUNAS)
            </span>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleAdjustWeight(-0.5)}
                className="w-11 h-11 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white flex items-center justify-center touch-press cursor-pointer"
                title="Restar 0.5 kg"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-baseline justify-center min-w-[120px]">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-24 bg-transparent text-4xl font-black font-mono text-white text-center outline-none tracking-tight"
                  required
                  autoFocus
                />
                <span className="text-lg font-bold text-zinc-400 ml-1">kg</span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustWeight(0.5)}
                className="w-11 h-11 rounded-xl bg-[#2C2D34] hover:bg-[#383A44] text-white flex items-center justify-center touch-press cursor-pointer"
                title="Sumar 0.5 kg"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-zinc-400">
              <span>Fecha:</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#2C2D34] px-2.5 py-1 rounded-lg text-white font-mono text-xs outline-none"
              />
            </div>
          </div>

          {/* Estimación de Grasa & V-Taper */}
          {estimatedBodyFat && (
            <div className="p-4 bg-[#1A1B20] rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                  COMPOSICIÓN ESTIMADA (US NAVY)
                </span>
                <span className="text-xs font-black text-white font-mono bg-[#2C2D34] px-2.5 py-0.5 rounded-full">
                  {estimatedBodyFat}% Grasa
                </span>
              </div>

              {breakdown && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-[#212227] rounded-xl text-center">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Masa Magra</span>
                    <div className="text-sm font-black text-white mt-0.5">
                      {breakdown.leanKg} kg
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#212227] rounded-xl text-center">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Masa Grasa</span>
                    <div className="text-sm font-black text-white mt-0.5">
                      {breakdown.fatKg} kg
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Perímetros en Centímetros */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 px-1">
              <Ruler className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                MEDIDAS CORPORALES (CM)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-[#1A1B20] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Cintura</span>
                <input
                  type="number"
                  step="0.5"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full text-center bg-[#2C2D34] py-1.5 rounded-lg text-sm font-black text-white outline-none"
                />
              </div>

              <div className="p-2.5 bg-[#1A1B20] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Pecho</span>
                <input
                  type="number"
                  step="0.5"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full text-center bg-[#2C2D34] py-1.5 rounded-lg text-sm font-black text-white outline-none"
                />
              </div>

              <div className="p-2.5 bg-[#1A1B20] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Brazo</span>
                <input
                  type="number"
                  step="0.5"
                  value={arm}
                  onChange={(e) => setArm(e.target.value)}
                  className="w-full text-center bg-[#2C2D34] py-1.5 rounded-lg text-sm font-black text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-[#1A1B20] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Muslo</span>
                <input
                  type="number"
                  step="0.5"
                  value={thigh}
                  onChange={(e) => setThigh(e.target.value)}
                  className="w-full text-center bg-[#2C2D34] py-1.5 rounded-lg text-sm font-black text-white outline-none"
                />
              </div>

              <div className="p-2.5 bg-[#1A1B20] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Cuello</span>
                <input
                  type="number"
                  step="0.5"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  className="w-full text-center bg-[#2C2D34] py-1.5 rounded-lg text-sm font-black text-white outline-none"
                />
              </div>

              <div className="p-2.5 bg-[#1A1B20] rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Estatura</span>
                <input
                  type="number"
                  step="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full text-center bg-[#2C2D34] py-1.5 rounded-lg text-sm font-black text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botón de Guardado Blanco Protagonista */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer touch-press shadow-xl shadow-white/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Peso & Medidas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
