import React, { useState, useEffect } from 'react'
import { X, Check, Scale, Ruler, Sparkles, Activity } from 'lucide-react'
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
  currentWeight = 77.9,
  lastEntry = null
}) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState(currentWeight)
  const [waist, setWaist] = useState(lastEntry?.waist || 83.0)
  const [chest, setChest] = useState(lastEntry?.chest || 104.0)
  const [arm, setArm] = useState(lastEntry?.arm || 38.0)
  const [thigh, setThigh] = useState(lastEntry?.thigh || 58.5)
  const [neck, setNeck] = useState(lastEntry?.neck || 39.0)
  const [height, setHeight] = useState(lastEntry?.height || 175)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0])
      setWeight(currentWeight)
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
      neck: neck ? Number(neck) : 39,
      height: height ? Number(height) : 175,
      bodyFatPct: estimatedBodyFat,
      notes: notes.trim() || 'Pesaje matutino en ayunas.'
    }

    onSaveMeasurement(newEntry)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl p-5 max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-sand-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-carbon-900 flex items-center justify-center text-coral-500 shadow-sm">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-carbon-900 leading-tight">
                Registrar Medidas & Peso
              </h3>
              <p className="text-[10px] text-neutral-400 font-semibold">
                Control antropométrico y composición corporal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sand-100 text-neutral-400 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar py-3.5 space-y-4">
          {/* Fecha y Peso Principal */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-black tracking-widest text-neutral-400 uppercase mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest text-neutral-400 uppercase mb-1">
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="77.9"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-xs font-black text-carbon-900 border border-sand-200 outline-none focus:border-coral-500 font-mono text-center"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Tarjeta de Estimación Biométrica en Vivo */}
          {estimatedBodyFat && (
            <div className="p-3.5 bg-sand-50 rounded-2xl border border-sand-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                  COMPOSICIÓN ESTIMADA (US NAVY)
                </span>
                <span className="text-xs font-black text-coral-500 font-mono">
                  {estimatedBodyFat}% Grasa
                </span>
              </div>

              {breakdown && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-white rounded-xl border border-sand-200/60 text-center">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">Masa Magra</span>
                    <div className="text-xs font-black text-carbon-900 mt-0.5">
                      {breakdown.leanKg} kg
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-sand-200/60 text-center">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">Masa Grasa</span>
                    <div className="text-xs font-black text-neutral-600 mt-0.5">
                      {breakdown.fatKg} kg
                    </div>
                  </div>
                </div>
              )}

              {vTaper && (
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-sand-200/60">
                  <span className="text-neutral-500 font-semibold">Índice V-Taper (Pecho/Cintura):</span>
                  <span className="font-bold text-carbon-900">{vTaper.ratio} ({vTaper.label})</span>
                </div>
              )}
            </div>
          )}

          {/* Perímetros en Centímetros */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Ruler className="w-3.5 h-3.5 text-coral-500" />
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                PERÍMETROS CORPORALES (CM)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Cintura</span>
                <input
                  type="number"
                  step="0.5"
                  placeholder="83"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full text-center py-1.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Pecho</span>
                <input
                  type="number"
                  step="0.5"
                  placeholder="104"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full text-center py-1.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Brazo</span>
                <input
                  type="number"
                  step="0.5"
                  placeholder="38"
                  value={arm}
                  onChange={(e) => setArm(e.target.value)}
                  className="w-full text-center py-1.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mt-2">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Muslo</span>
                <input
                  type="number"
                  step="0.5"
                  placeholder="58.5"
                  value={thigh}
                  onChange={(e) => setThigh(e.target.value)}
                  className="w-full text-center py-1.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Cuello</span>
                <input
                  type="number"
                  step="0.5"
                  placeholder="39"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  className="w-full text-center py-1.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Estatura</span>
                <input
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full text-center py-1.5 bg-sand-100 rounded-xl text-xs font-bold text-carbon-900 border border-sand-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-[10px] font-black tracking-widest text-neutral-400 uppercase mb-1">
              Notas del Check-in
            </label>
            <input
              type="text"
              placeholder="Ej: Pesaje en ayunas, pre-desayuno..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-sand-100 rounded-xl text-xs font-medium text-carbon-900 border border-sand-200 outline-none"
            />
          </div>

          {/* Botón de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-carbon-900 hover:bg-black text-white text-xs font-black rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4 text-coral-500" />
              <span>Guardar Registro Físico</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
