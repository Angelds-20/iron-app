import React, { useState } from 'react'
import {
  Zap,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Activity,
  Award
} from 'lucide-react'

export function RirGuideView() {
  const [selectedRir, setSelectedRir] = useState(2)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const rirLevels = [
    {
      level: 3,
      badge: 'RIR 3',
      name: 'Aproximación & Técnica',
      color: 'text-sky-700',
      tagColor: 'bg-sky-500 text-white',
      description: 'Te quedaban 3 repeticiones más antes de llegar al fallo.',
      barSpeed: 'Rápida y fluida sin desaceleración notable',
      feel: 'Sientes la carga pero no hay fatiga neuromuscular profunda.',
      angelAdvice: 'Úsalo en tus series de aproximación antes de cargar los 60 kg en banca o remo.'
    },
    {
      level: 2,
      badge: 'RIR 2',
      name: 'Zona Dorada de Hipertrofia & Fuerza',
      color: 'text-emerald-700',
      tagColor: 'bg-emerald-600 text-white',
      isRecommended: true,
      description: 'Te quedaban exactamente 2 repeticiones antes del fallo técnico.',
      barSpeed: 'La barra desacelera en las 2 últimas repeticiones pero no se traba',
      feel: 'Esfuerzo alto con concentración total; técnica y postura 100% impecables.',
      angelAdvice: '¡Tu zona objetivo en patio! Te da el 95% del estímulo de crecimiento con fatiga controlada para el sistema nervioso.'
    },
    {
      level: 1,
      badge: 'RIR 1',
      name: 'Esfuerzo Máximo Seguro',
      color: 'text-amber-700',
      tagColor: 'bg-amber-600 text-white',
      description: 'Solo podías sacar 1 repetición más con buena técnica.',
      barSpeed: 'Desaceleración marcada en la última repetición',
      feel: 'Tensión muscular extrema; demanda empujar con todo.',
      angelAdvice: 'Aplica RIR 1 en la 3ª serie cuando quieras auditar si estás listo para subir reps o peso.'
    },
    {
      level: 0,
      badge: 'RIR 0',
      name: 'Fallo Técnico Concéntrico',
      color: 'text-rose-700',
      tagColor: 'bg-rose-600 text-white',
      description: 'Imposible completar otra repetición con técnica estricta.',
      barSpeed: 'La barra se frena o no sube más',
      feel: 'Incapacidad física de mover la carga.',
      angelAdvice: 'En press de banca de 60 kg en patio sin jaula de seguridad, evita llegar a RIR 0 absoluto para no quedar atrapado.'
    }
  ]

  const faqs = [
    {
      q: '¿Por qué en la app se le llama RIR / RIP?',
      a: 'RIR significa "Reps In Reserve" (Repeticiones en Reserva). Es la métrica estándar de oro de la biomecánica deportiva moderna (Eric Helms, Mike Israetel) para medir el esfuerzo real sin llegar a la lesión ni quemar el sistema nervioso.'
    },
    {
      q: '¿Cómo sé exactamente cuál es mi RIR al terminar una serie?',
      a: 'Pregúntate con honestidad al terminar la serie: "Si tuviera una recompensa de $1.000 por cada repetición extra con buena técnica, ¿cuántas más habría podido sacar?". Si la respuesta es 2 reps, tu serie fue RIR 2.'
    },
    {
      q: '¿Cuándo debo subir el peso o las repeticiones con mi barra de 60 kg?',
      a: 'Si completas tus 3 series de 10 reps terminando la última serie con RIR 2 o 3, la sobrecarga progresiva se ha consolidado: ¡puedes aumentar a 11-12 reps o añadir 2.5 kg en la siguiente sesión!'
    }
  ]

  const activeLevel = rirLevels.find((l) => l.level === selectedRir) || rirLevels[1]

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Cabecera Limpia */}
      <div className="px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          AUTOREGULACIÓN & ESFUERZO PERCIBIDO
        </span>
        <h2 className="text-xl font-black text-carbon-900 leading-tight">
          Escala RIR / RIP
        </h2>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          <strong className="text-carbon-900 font-bold">Reps In Reserve:</strong> cuántas repeticiones más podías haber completado antes del fallo técnico real.
        </p>
      </div>

      {/* TARJETA MAESTRA DE RIR (Sin matriosca de cajas) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/70 space-y-4">
        {/* Selector de Nivel RIR */}
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            Selecciona un nivel de esfuerzo
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {rirLevels.map((lvl) => {
              const isCurrent = selectedRir === lvl.level
              return (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => setSelectedRir(lvl.level)}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-carbon-900 text-white font-black shadow-xs'
                      : 'bg-sand-100 text-neutral-600 hover:text-carbon-900 font-bold'
                  }`}
                >
                  <div className="text-xs font-mono">{lvl.badge}</div>
                  <div className="text-[9px] opacity-75">{lvl.level === 0 ? 'Fallo' : `${lvl.level} reps`}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detalle del RIR Activo (Integrado fluidamente) */}
        <div className="pt-3 border-t border-sand-200/60 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${activeLevel.tagColor}`}>
              {activeLevel.badge}
            </span>
            <h3 className="text-base font-black text-carbon-900 leading-tight">
              {activeLevel.name}
            </h3>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            {activeLevel.description}
          </p>

          <div className="space-y-2 text-xs pt-2">
            <div className="flex items-start gap-2">
              <Activity className="w-3.5 h-3.5 text-coral-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-carbon-900">Velocidad de barra: </strong>
                <span className="text-neutral-600">{activeLevel.barSpeed}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Award className="w-3.5 h-3.5 text-coral-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-carbon-900">Sensación corporal: </strong>
                <span className="text-neutral-600">{activeLevel.feel}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-carbon-900">Para tus entrenos en patio: </strong>
                <span className="text-neutral-600">{activeLevel.angelAdvice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Semáforo de Decisión para 60 kg */}
        <div className="pt-3 border-t border-sand-200/60 space-y-2">
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase block">
            SEMÁFORO DE SOBRECARGA (60 KG)
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="font-extrabold text-carbon-900">Verde (RIR 2 o 3 en las 10 reps): </strong>
                <span className="text-neutral-600">Tienes margen sobrante. En tu siguiente entreno intenta sacar 11-12 reps o sumar 2.5 kg a la barra.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="font-extrabold text-carbon-900">Amarillo (RIR 1 en la serie final): </strong>
                <span className="text-neutral-600">Esfuerzo exacto. Mantén los 60 kg la próxima sesión y enfócate en bajar en 3 segundos controlados.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 flex-shrink-0 mt-1" />
              <div>
                <strong className="font-extrabold text-carbon-900">Gris (Te quedaste en 6 reps): </strong>
                <span className="text-neutral-600">Fatiga acumulada esperable. Tu objetivo la próxima semana es sacar 7 u 8 repeticiones con los mismos 60 kg.</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Limpias (Sin matriosca) */}
        <div className="pt-3 border-t border-sand-200/60 space-y-2">
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase block">
            PREGUNTAS FRECUENTES
          </span>

          <div className="divide-y divide-sand-200/60">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index
              return (
                <div key={index} className="py-2.5">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full text-left text-xs font-bold text-carbon-900 flex items-center justify-between gap-2 cursor-pointer hover:text-coral-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pt-2 text-xs text-neutral-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
