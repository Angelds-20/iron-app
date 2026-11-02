import React, { useState } from 'react'
import {
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react'

export function ExerciseTechniqueView({ onStartExerciseRoutine = null }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const exercises = [
    {
      id: 'bench-press',
      title: 'Press de Banca Plano',
      category: 'pecho',
      equipment: 'Barra 60 kg • Banco Plano',
      muscles: 'Pectoral Mayor, Tríceps, Deltoides Anterior',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      tempo: '3-1-1-0 (3s bajada, 1s pausa en pecho, 1s subida explosiva)',
      athleteNote: 'Al medir 194 cm, tu envergadura de brazos es amplia. Mantener 1 segundo de pausa abajo elimina el rebote elástico y protege los tendones del hombro.',
      cues: [
        {
          title: 'Retracción Escapular Activa',
          desc: 'Junta los omóplatos y clávalos en el banco antes de sacar la barra para crear una base rígida.'
        },
        {
          title: 'Trayectoria en Forma de J',
          desc: 'Baja la barra al esternón inferior y empuja hacia arriba y atrás en dirección a los ojos.'
        },
        {
          title: 'Pausa de 1 Segundo en el Pecho',
          desc: 'Cero rebote con 60 kg. La pausa convierte la tensión en fuerza pura concéntrica sin dañar articulaciones.'
        },
        {
          title: 'Leg Drive (Empuje con Pies)',
          desc: 'Apoya los pies planos en el suelo y empuja hacia adelante para estabilizar la pelvis.'
        }
      ],
      mistake: 'Abrir los codos a 90° respecto al cuerpo. Mantenlos en forma de flecha a 70°-75° para no lesionar el manguito rotador.'
    },
    {
      id: 'incline-bench-press',
      title: 'Press Inclinado con Barra',
      category: 'pecho',
      equipment: 'Barra 60 kg • Banco a 30°-45°',
      muscles: 'Haz Clavicular (Pectoral Superior), Deltoides Anterior',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      tempo: '3-0-1-0 (3s descenso controlado, subida firme)',
      athleteNote: 'Ayer sacaste 2 series de 10 reps y la 3ª de 6 reps con 60 kg. Esa fatiga en la serie final es normal; no arquees la espalda baja para compensar.',
      cues: [
        {
          title: 'Ángulo Óptimo a 30°-45°',
          desc: 'Si subes el respaldo a más de 45°, el esfuerzo pasa del pecho alto a los hombros.'
        },
        {
          title: 'Toque Clavicular Superior',
          desc: 'Desciende la barra rozando suavemente la parte alta del pecho, justo bajo las clavículas.'
        },
        {
          title: 'Muñecas Neutras y Rígidas',
          desc: 'No permitas que las muñecas se doblen hacia atrás con los 60 kg; mantenlas en línea con los antebrazos.'
        },
        {
          title: 'Glúteos Adheridos al Asiento',
          desc: 'Mantén la pelvis firme en el asiento para no deformar el ángulo de empuje.'
        }
      ],
      mistake: 'Rebotar la barra en la parte alta del pecho. Con 60 kg, baja en 3 segundos estricto.'
    },
    {
      id: 'barbell-row',
      title: 'Remo con Barra al Pecho',
      category: 'espalda',
      equipment: 'Barra 60 kg • Agarre Prono',
      muscles: 'Dorsal Ancho, Romboides, Trapecio Medio, Bíceps',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      tempo: '2-1-1-0 (Tirón enérgico, 1s apretando escápulas, 2s bajada)',
      athleteNote: 'A 194 cm y 120 kg, la palanca en tu zona lumbar es alta. Bloquea glúteos y abdomen para mantener la columna blindada.',
      cues: [
        {
          title: 'Inclinación de Torso a 45°',
          desc: 'Bisagra de cadera hacia atrás con rodillas semi-flexionadas y espalda totalmente recta.'
        },
        {
          title: 'Tirón Liderado por los Codos',
          desc: 'Conduce el movimiento impulsando los codos hacia atrás y arriba, no tirando con los brazos.'
        },
        {
          title: 'Contacto en el Esternón Inferior',
          desc: 'Lleva la barra hacia la boca del estómago manteniendo los codos cerca del cuerpo.'
        },
        {
          title: 'Pico de Contracción Escapular',
          desc: 'Junta y aprieta los omóplatos durante 1 segundo arriba antes de soltar la carga.'
        }
      ],
      mistake: 'Pegar tirones con la espalda baja o balancear el tronco para subir los 60 kg. El torso debe ser una roca.'
    },
    {
      id: 'french-press',
      title: 'Press Francés (Tríceps)',
      category: 'brazos',
      equipment: 'Barra chica 14 kg • Banco Plano',
      muscles: 'Tríceps (Cabeza Larga y Lateral)',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      tempo: '2-1-1-0 (2s descenso tras coronilla, extensión completa)',
      athleteNote: 'Tus 3 series de 15 reps con 14 kg dan congestión profunda. Mantén los codos quietos para que trabaje el tríceps y no el dorsal.',
      cues: [
        {
          title: 'Codos Apuntando al Techo',
          desc: 'Fija los codos perpendiculares o inclinados 10° hacia atrás para mantener tensión continua.'
        },
        {
          title: 'Descenso Tras la Coronilla',
          desc: 'Baja la barra de 14 kg detrás de la frente para estirar la cabeza larga del tríceps.'
        },
        {
          title: 'Codos Sin Abrirse',
          desc: 'No permitas que los codos se separen hacia los laterales durante la flexión.'
        },
        {
          title: 'Extensión Controlada',
          desc: 'Extiende los antebrazos apretando los tríceps sin golpear el tope de la articulación.'
        }
      ],
      mistake: 'Adelantar los codos al subir como si fuera un press de banca cerrado. El brazo superior no se mueve.'
    },
    {
      id: 'biceps-curl',
      title: 'Curl de Bíceps con Barra Chica',
      category: 'brazos',
      equipment: 'Barra chica 14 kg • De Pie',
      muscles: 'Bíceps Braquial, Braquial Anterior, Antebrazos',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      tempo: '3-0-1-0 (1s subida estricta, 3s bajada excéntrica)',
      athleteNote: 'Las 15 reps con 14 kg exigen control estricto. Cero balanceo de torso; la bajada de 3 segundos es donde se construye el pico del bíceps.',
      cues: [
        {
          title: 'Codos Anclados a Costillas',
          desc: 'Fija los codos a tus costados y no los balancees hacia adelante al iniciar el levantamiento.'
        },
        {
          title: 'Bajada Excéntrica en 3 Segundos',
          desc: 'Frena el descenso de la barra en 3 segundos para estimular el mayor número de fibras.'
        },
        {
          title: 'Postura Erguida',
          desc: 'Aprieta glúteos y abdomen para no arquear la columna lumbar al fatigarte.'
        },
        {
          title: 'Rango Completo',
          desc: 'Baja la barra hasta casi estirar los brazos antes de iniciar la siguiente repetición.'
        }
      ],
      mistake: 'Tirar la espalda hacia atrás para impulsarse en las últimas 3 repeticiones.'
    }
  ]

  const filteredExercises =
    activeCategory === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === activeCategory)

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Cabecera Limpia */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            BIOMECÁNICA & EJECUCIÓN
          </span>
          <h2 className="text-xl font-black text-carbon-900 leading-tight">
            Consejos de Ejercicio
          </h2>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex items-center gap-1">
          {['all', 'pecho', 'espalda', 'brazos'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-carbon-900 text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-carbon-900 bg-white border border-sand-200/80'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas Editoriales de Ejercicios (Sin cajas anidadas) */}
      <div className="space-y-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xs border border-sand-200/70"
          >
            {/* Foto con Banner y Título Directo */}
            <div className="relative h-44 w-full bg-carbon-900">
              <img
                src={ex.image}
                alt={ex.title}
                className="w-full h-full object-cover opacity-85"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-carbon-900/80 backdrop-blur-md text-[10px] font-black text-coral-500 uppercase tracking-wider border border-white/10">
                  {ex.equipment}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                  {ex.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-lg font-black text-white leading-tight">
                  {ex.title}
                </h3>
                <span className="text-[11px] text-neutral-300 font-medium block mt-0.5">
                  {ex.muscles}
                </span>
              </div>
            </div>

            {/* Contenido Biomecánico Fluido (Sin Matriosca) */}
            <div className="p-5 space-y-3.5">
              {/* Tempo & Ajuste Personal para Angel */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <Clock className="w-3 h-3 text-coral-500" />
                  <span>Tempo Recomendado:</span>
                  <span className="text-carbon-900 font-mono font-black">{ex.tempo}</span>
                </div>
                {ex.athleteNote && (
                  <p className="border-l-2 border-coral-500 pl-3 py-0.5 text-[11px] text-neutral-600 leading-relaxed italic">
                    <strong className="text-carbon-900 not-italic font-bold">Para ti (194 cm / 120 kg): </strong>
                    {ex.athleteNote}
                  </p>
                )}
              </div>

              {/* Claves de Ejecución (Lista limpia con división tipográfica) */}
              <div className="pt-2 border-t border-sand-200/50">
                <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase block mb-2">
                  PUNTOS CLAVE DE TÉCNICA
                </span>
                <div className="space-y-2 text-xs">
                  {ex.cues.map((cue, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-sand-100 text-carbon-900 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                        {cIdx + 1}
                      </span>
                      <div className="leading-snug">
                        <strong className="font-extrabold text-carbon-900">{cue.title}: </strong>
                        <span className="text-neutral-600">{cue.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error a Evitar (Línea sutil de advertencia) */}
              <div className="pt-2 border-t border-sand-200/50 flex items-start gap-2 text-[11px] text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-black text-rose-950">Error a evitar: </strong>
                  <span className="text-rose-800">{ex.mistake}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
