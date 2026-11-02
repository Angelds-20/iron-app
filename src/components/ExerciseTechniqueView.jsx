import React, { useState } from 'react'
import {
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
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
      athleteNote: 'Al medir 194 cm, tu envergadura y recorrido de brazos es largo. Mantener la pausa de 1 segundo abajo disipa la inercia y protege tus pectorales.',
      cues: [
        {
          title: 'Retracción Escapular Activa',
          desc: 'Junta los omóplatos y clávalos contra el banco antes de sacar la barra. Crea una plataforma sólida para empujar.'
        },
        {
          title: 'Trayectoria en forma de J',
          desc: 'Baja la barra a la parte baja del esternón y empuja hacia arriba y ligeramente atrás, alineándola sobre los hombros.'
        },
        {
          title: 'Pausa de 1 Segundo en el Pecho',
          desc: 'Cero rebote con los 60 kg. La pausa convierte el estiramiento en tensión mecánica pura para mayor hipertrofia.'
        },
        {
          title: 'Leg Drive (Empuje de Piernas)',
          desc: 'Apoya los pies planos en el suelo y empuja el suelo hacia adelante con los cuádriceps para estabilizar la pelvis.'
        }
      ],
      mistake: 'Abrir los codos a 90° respecto al cuerpo. Mantén los codos en un ángulo de 70°-75° (forma de flecha) para salvar tus manguitos rotadores.'
    },
    {
      id: 'incline-bench-press',
      title: 'Press Inclinado con Barra',
      category: 'pecho',
      equipment: 'Barra 60 kg • Banco a 30°-45°',
      muscles: 'Haz Clavicular (Pectoral Superior), Deltoides Anterior',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      tempo: '3-0-1-0 (3s descenso controlado, subida firme)',
      athleteNote: 'Ayer lograste 2 series de 10 reps y una 3ª de 6 reps con 60 kg. Esa fatiga en la 3ª serie es biomecánicamente esperable; prioriza no arquear la espalda baja.',
      cues: [
        {
          title: 'Ángulo Óptimo de Inclinación',
          desc: 'Ajusta el respaldo entre 30° y 45°. Si lo subes a más de 45°, el trabajo pasa del pecho a los hombros.'
        },
        {
          title: 'Punto de Contacto Clavicular',
          desc: 'La barra debe descender justo por debajo de las clavículas, más arriba que en el banco plano.'
        },
        {
          title: 'Muñecas Fuertes y Neutras',
          desc: 'Evita que las muñecas se doblen hacia atrás por el peso de los 60 kg. Envuélvela con pulgar firme.'
        },
        {
          title: 'Glúteos Pegados al Asiento',
          desc: 'No despegues la cadera para compensar la inclinación. Mantén el contacto completo con el banco.'
        }
      ],
      mistake: 'Rebotar la barra en las clavículas. Con 60 kg en banco inclinado, una bajada descontrolada puede causar microtraumatismos esternoclaviculares.'
    },
    {
      id: 'barbell-row',
      title: 'Remo con Barra al Pecho',
      category: 'espalda',
      equipment: 'Barra 60 kg • Agarre Prono',
      muscles: 'Dorsal Ancho, Romboides, Trapecio Medio, Bíceps',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      tempo: '2-1-1-0 (Tirón enérgico, 1s apretando escápulas, 2s bajada)',
      athleteNote: 'A 194 cm y 120 kg, tu brazo de palanca en la espalda baja es significativo. Activa los glúteos e isquiotibiales para proteger la zona lumbar.',
      cues: [
        {
          title: 'Inclinación de Torso a 45°',
          desc: 'Bisagra de cadera hacia atrás. Mantén la columna en línea recta desde la coronilla hasta el coxis.'
        },
        {
          title: 'Tira con los Codos, no con Manos',
          desc: 'Imagina que tus manos son simples garfios. Guía la trayectoria impulsando los codos hacia atrás y arriba.'
        },
        {
          title: 'Contacto en el Esternón Inferior',
          desc: 'Lleva la barra rozando los muslos hacia la boca del estómago o esternón inferior para máximo reclutamiento.'
        },
        {
          title: 'Pico de Contracción Escapular',
          desc: 'Aprieta los omóplatos durante 1 segundo arriba antes de permitir que el peso descienda.'
        }
      ],
      mistake: 'Incorporar el tronco violentamente para ayudarse de la inercia. Si el torso se mueve más de 10°, reduce la carga o enfócate en series más estrictas.'
    },
    {
      id: 'french-press',
      title: 'Press Francés (Extensión Tríceps)',
      category: 'brazos',
      equipment: 'Barra chica 14 kg • Banco Plano',
      muscles: 'Tríceps (Cabeza Larga y Lateral)',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      tempo: '2-1-1-0 (2s descenso tras nuca, extensión completa)',
      athleteNote: 'Tus 3 series de 15 reps con 14 kg son ideales para hipertrofia metabólica. Mantén los codos fijos para no convertirlo en pullover.',
      cues: [
        {
          title: 'Codos Apuntando al Techo',
          desc: 'Fija los codos perpendiculares al suelo o ligeramente inclinados hacia atrás (10°) para mantener tensión continua.'
        },
        {
          title: 'Descenso hacia la Coronilla',
          desc: 'Baja la barra de 14 kg detrás de la frente o coronilla, estirando la cabeza larga del tríceps al máximo.'
        },
        {
          title: 'Sin Abrir los Codos',
          desc: 'No permitas que los codos se abran hacia los laterales. Imagina que sostienes un balón entre ellos.'
        },
        {
          title: 'Extensión sin Bloqueo Violento',
          desc: 'Estira los brazos contrayendo los tríceps pero sin hiperextender bruscamente la articulación del codo.'
        }
      ],
      mistake: 'Mover los brazos hacia adelante como si fuera un press de pecho cerrado. El húmero (brazo superior) debe permanecer inmóvil.'
    },
    {
      id: 'biceps-curl',
      title: 'Curl de Bíceps con Barra Chica',
      category: 'brazos',
      equipment: 'Barra chica 14 kg • De Pie',
      muscles: 'Bíceps Braquial, Braquial Anterior, Antebrazos',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      tempo: '3-0-1-0 (1s subida estricta, 3s bajada excéntrica)',
      athleteNote: 'Las 15 reps con 14 kg requieren resistencia a la fatiga. Cero balanceo lumbar; si es necesario, apoya la espalda contra una pared de patio.',
      cues: [
        {
          title: 'Codos Anclados a las Costillas',
          desc: 'Pega los codos a tus costados y no los adelantes al subir la barra. El movimiento es pura flexión de codo.'
        },
        {
          title: 'Fase Excéntrica Lenta (3 seg)',
          desc: 'No dejes caer la barra. Resiste el peso en la bajada durante 3 segundos para romper fibras miofibrilares.'
        },
        {
          title: 'Cuerpo Erguido y Glúteos Firmes',
          desc: 'Aprieta el abdomen y los glúteos para evitar cualquier balanceo o latigazo de la columna lumbar.'
        },
        {
          title: 'Rango de Movimiento Completo',
          desc: 'Baja la barra hasta casi tocar los muslos antes de iniciar la siguiente repetición.'
        }
      ],
      mistake: 'Tirar la espalda hacia atrás en las últimas repeticiones. Es preferible parar en 13 reps con técnica pulcra que forzar 15 con inercia lumbar.'
    }
  ]

  const filteredExercises =
    activeCategory === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === activeCategory)

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Encabezado */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-xl bg-coral-50 text-coral-500 flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            BIOMECÁNICA & EJECUCIÓN
          </span>
        </div>
        <h2 className="text-xl font-black text-carbon-900 leading-tight">
          Consejos & Técnica de Patio
        </h2>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          Puntos clave para sacar el máximo estímulo a tu barra de 60 kg y barra de 14 kg evitando lesiones.
        </p>

        {/* Filtros de Categoría */}
        <div className="flex items-center gap-1.5 mt-3.5 pt-3 border-t border-sand-200/60 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
              activeCategory === 'all'
                ? 'bg-carbon-900 text-white shadow-xs'
                : 'bg-sand-100 text-neutral-600 hover:bg-sand-200'
            }`}
          >
            Todos ({exercises.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('pecho')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
              activeCategory === 'pecho'
                ? 'bg-carbon-900 text-white shadow-xs'
                : 'bg-sand-100 text-neutral-600 hover:bg-sand-200'
            }`}
          >
            Pecho (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('espalda')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
              activeCategory === 'espalda'
                ? 'bg-carbon-900 text-white shadow-xs'
                : 'bg-sand-100 text-neutral-600 hover:bg-sand-200'
            }`}
          >
            Espalda (1)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('brazos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
              activeCategory === 'brazos'
                ? 'bg-carbon-900 text-white shadow-xs'
                : 'bg-sand-100 text-neutral-600 hover:bg-sand-200'
            }`}
          >
            Brazos (2)
          </button>
        </div>
      </div>

      {/* Lista de Tarjetas de Ejercicios */}
      <div className="space-y-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xs border border-sand-200/80 transition-all hover:border-carbon-800"
          >
            {/* Imagen Principal con Overlay */}
            <div className="relative h-44 w-full bg-carbon-900 overflow-hidden">
              <img
                src={ex.image}
                alt={ex.title}
                className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Badges superiores */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-carbon-900/80 backdrop-blur-md text-[10px] font-black text-coral-500 uppercase tracking-wider border border-white/10">
                  {ex.equipment}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                  {ex.category}
                </span>
              </div>

              {/* Título sobre la imagen */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-lg font-black text-white leading-tight">
                  {ex.title}
                </h3>
                <span className="text-[11px] text-neutral-300 font-medium block mt-0.5 line-clamp-1">
                  {ex.muscles}
                </span>
              </div>
            </div>

            {/* Contenido Técnico */}
            <div className="p-5 space-y-3.5">
              {/* Tempo & Nota del Atleta */}
              <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-coral-600 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tempo Sugerido:</span>
                  <span className="text-carbon-900 font-mono font-black">{ex.tempo}</span>
                </div>
                {ex.athleteNote && (
                  <p className="text-[11px] text-neutral-600 leading-relaxed pt-1 border-t border-sand-200/50">
                    <strong className="text-carbon-900 font-bold">Ajuste para ti (194 cm / 120 kg): </strong>
                    {ex.athleteNote}
                  </p>
                )}
              </div>

              {/* 4 Puntos Clave de Técnica */}
              <div>
                <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase block mb-2">
                  CLAVES DE EJECUCIÓN
                </span>
                <div className="space-y-2">
                  {ex.cues.map((cue, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 text-xs">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <div>
                        <strong className="font-extrabold text-carbon-900">{cue.title}: </strong>
                        <span className="text-neutral-600 leading-snug">{cue.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error común a evitar */}
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/70 text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black text-rose-950 block">Error crítico a evitar:</strong>
                  <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">{ex.mistake}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
