import React, { useState } from 'react'
import {
  ShieldAlert,
  Zap,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Activity,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export function RirGuideView({ onSelectRirFilter = null }) {
  const [selectedRir, setSelectedRir] = useState(2)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const rirLevels = [
    {
      level: 3,
      badge: 'RIR 3',
      name: 'Aproximación & Técnica',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      tagColor: 'bg-sky-500 text-white',
      accentColor: 'text-sky-600',
      description: 'Quedan 3 repeticiones en reserva antes de fallar.',
      barSpeed: 'Rápida y fluida',
      targetSets: 'Series de calentamiento o trabajo técnico',
      feel: 'Sientes la carga pero no hay desaceleración notable de la barra.',
      angelAdvice: 'Ideal en las primeras series de calentamiento antes de cargar los 60 kg.'
    },
    {
      level: 2,
      badge: 'RIR 2',
      name: 'Zona Dorada de Hipertrofia',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tagColor: 'bg-emerald-600 text-white',
      accentColor: 'text-emerald-700',
      isRecommended: true,
      description: 'Quedan 2 repeticiones en reserva antes del fallo técnico.',
      barSpeed: 'Ligera desaceleración en las 2 últimas reps',
      targetSets: 'Series efectivas 1 y 2 de Banca, Inclinado y Remo',
      feel: 'Esfuerzo alto y concentración total, pero mantienes la postura y técnica 100% impecables.',
      angelAdvice: '¡Tu zona objetivo! Te da el 95% del estímulo muscular acumulado sin sobrecargar tus articulaciones ni el sistema nervioso central en el patio.'
    },
    {
      level: 1,
      badge: 'RIR 1',
      name: 'Esfuerzo Máximo Seguro',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      tagColor: 'bg-amber-600 text-white',
      accentColor: 'text-amber-700',
      description: 'Solo podías completar 1 repetición más con buena técnica.',
      barSpeed: 'Desaceleración marcada en la última rep',
      targetSets: 'Última serie del ejercicio principal',
      feel: 'La barra sube lenta y demanda máxima tensión en pecho, tríceps o espalda.',
      angelAdvice: 'Aplica RIR 1 en la 3ª serie de tus ejercicios cuando quieras auditar si estás listo para dar el salto a más reps.'
    },
    {
      level: 0,
      badge: 'RIR 0',
      name: 'Fallo Técnico Concéntrico',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      tagColor: 'bg-rose-600 text-white',
      description: 'Imposible completar otra repetición con técnica estricta.',
      barSpeed: 'La barra casi se detiene o se frena por completo',
      targetSets: 'Solo en barra chica (brazos) o pruebas puntuales',
      feel: 'Incapacidad física de empujar o tirar. Fatiga neuromuscular extrema.',
      angelAdvice: 'Precaución en press de banca de 60 kg en patio sin spotter/ayudante: nunca busques RIR 0 absoluto en banca plana para evitar accidentes. Deja siempre RIR 1 o 2.'
    }
  ]

  const faqs = [
    {
      q: '¿Por qué en la app se le llama RIR / RIP?',
      a: 'RIR significa "Reps In Reserve" (Repeticiones en Reserva). Es la métrica estándar de oro de la biomecánica moderna y la autoregulación deportiva (Mike Israetel, Eric Helms) para medir el esfuerzo real sin necesidad de llegar a lesionarte.'
    },
    {
      q: '¿Cómo sé exactamente cuál es mi RIR al terminar una serie?',
      a: 'Hazte esta pregunta al terminar la serie: "Si tuviera una recompensa de $1.000 por cada repetición extra con buena técnica, ¿cuántas más habría podido sacar?". Si la respuesta honesta es 2 reps, tu serie fue RIR 2.'
    },
    {
      q: '¿Cuándo debo subir el peso o las repeticiones con mi barra de 60 kg?',
      a: 'Si completas tus 3 series de 10 reps terminando la última serie con RIR 2 o superior, la sobrecarga progresiva se ha consolidado: ¡puedes aumentar a 11-12 reps o añadir 2.5 kg en la siguiente sesión!'
    }
  ]

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Encabezado Principal */}
      <div className="bg-carbon-900 text-white rounded-3xl p-5 shadow-sm border border-carbon-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-xl bg-coral-500/20 text-coral-500 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-coral-500">
            GUÍA DE ESFUERZO PERCIBIDO
          </span>
        </div>

        <h2 className="text-xl font-black text-white leading-tight">
          Escala RIR / RIP
        </h2>
        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
          <strong className="text-white">Reps In Reserve:</strong> la métrica para medir cuánto te faltó para el fallo muscular y saber con precisión cuándo aumentar peso.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-carbon-800 text-[11px]">
          <div className="p-2.5 rounded-2xl bg-carbon-800/80 border border-carbon-700/60">
            <span className="text-[9px] font-bold text-neutral-400 uppercase block">Zona Óptima</span>
            <span className="font-extrabold text-emerald-400 font-mono text-sm">RIR 2</span>
            <span className="text-[9px] text-neutral-300 block mt-0.5">Máximo estímulo con fatiga baja</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-carbon-800/80 border border-carbon-700/60">
            <span className="text-[9px] font-bold text-neutral-400 uppercase block">Seguridad en Patio</span>
            <span className="font-extrabold text-amber-400 font-mono text-sm">Evitar RIR 0</span>
            <span className="text-[9px] text-neutral-300 block mt-0.5">En banca de 60 kg sin ayudante</span>
          </div>
        </div>
      </div>

      {/* Selector de Nivel RIR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            DESGLOSE DE CADA NIVEL
          </span>
          <span className="text-[10px] font-bold text-neutral-500">
            Toca para explorar
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {rirLevels.map((lvl) => {
            const isCurrent = selectedRir === lvl.level
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => setSelectedRir(lvl.level)}
                className={`py-2 px-1 rounded-2xl text-center border transition-all cursor-pointer ${
                  isCurrent
                    ? `${lvl.tagColor} border-transparent shadow-sm font-black scale-102`
                    : 'bg-white text-carbon-900 border-sand-200/80 hover:bg-sand-50 font-bold'
                }`}
              >
                <div className="text-xs font-mono">{lvl.badge}</div>
                <div className="text-[9px] opacity-80 line-clamp-1">{lvl.level === 0 ? 'Fallo' : `${lvl.level} reps`}</div>
              </button>
            )
          })}
        </div>

        {/* Tarjeta Detallada del RIR Seleccionado */}
        {(() => {
          const active = rirLevels.find((l) => l.level === selectedRir) || rirLevels[1]
          return (
            <div className={`p-5 rounded-3xl border shadow-xs transition-all ${active.color}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${active.tagColor}`}>
                      {active.badge}
                    </span>
                    {active.isRecommended && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-200/60 text-emerald-900 uppercase">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black mt-2 leading-tight">
                    {active.name}
                  </h3>
                  <p className="text-xs mt-1 font-medium opacity-90">
                    {active.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-3.5 border-t border-black/10 text-xs">
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                  <div>
                    <span className="font-bold">Velocidad de la barra: </span>
                    <span className="opacity-90">{active.barSpeed}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                  <div>
                    <span className="font-bold">Sensación del cuerpo: </span>
                    <span className="opacity-90">{active.feel}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                  <div>
                    <span className="font-bold">Aplicación en tu entreno: </span>
                    <span className="opacity-90">{active.angelAdvice}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Regla Práctica de Sobrecarga para Angel */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-coral-500" />
          <h3 className="text-sm font-black text-carbon-900 uppercase tracking-wide">
            Semáforo de Carga para 60 kg
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900">
            <div className="font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Verde: Completaste 10 reps con RIR 2 o RIR 3</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">
              Tienes margen sobrante. En tu siguiente entreno intenta subir a 11-12 reps o sumar 2.5 kg a la barra.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900">
            <div className="font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Amarillo: Terminaste la última serie en RIR 1</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1">
              Esfuerzo exacto. Mantén los 60 kg la próxima sesión y enfócate en bajar en 3 segundos controlados.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-sand-100/80 border border-sand-200 text-neutral-800">
            <div className="font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span>Gris: Te quedaste en 6 reps (ej. Inclinado serie 3)</span>
            </div>
            <p className="text-[11px] text-neutral-600 mt-1">
              Fatiga normal por el peso previo. Tu objetivo la próxima semana es sacar 7 u 8 repeticiones con los mismos 60 kg.
            </p>
          </div>
        </div>
      </div>

      {/* Preguntas Frecuentes Desplegables */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-coral-500" />
          <h3 className="text-sm font-black text-carbon-900 uppercase tracking-wide">
            Dudas Clave sobre RIR
          </h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-sand-200/80 bg-sand-50/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-3.5 text-left text-xs font-bold text-carbon-900 flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-sand-200/40">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
