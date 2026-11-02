import React, { useState } from 'react'
import {
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react'

export function ExerciseTechniqueView({ onStartExerciseRoutine = null }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedExerciseId, setExpandedExerciseId] = useState(null)

  const exercises = [
    {
      id: 'bench-press',
      title: 'Press de Banca Plano',
      category: 'pecho',
      equipment: '60 kg • Banco Plano',
      muscles: 'Pectoral Mayor, Tríceps, Deltoides',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      tempoShort: '3-1-1-0',
      tempoDesc: '3s bajada, 1s pausa en pecho, 1s subida',
      targetSets: '3 × 10 reps',
      rir: 'RIR 2',
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
      equipment: '60 kg • Banco a 30°-45°',
      muscles: 'Pectoral Superior, Deltoides Anterior',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      tempoShort: '3-0-1-0',
      tempoDesc: '3s descenso controlado, subida firme',
      targetSets: '2×10 + 1×6 reps',
      rir: 'RIR 1-2',
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
      equipment: '60 kg • Agarre Prono',
      muscles: 'Dorsal Ancho, Romboides, Bíceps',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      tempoShort: '2-1-1-0',
      tempoDesc: 'Tirón enérgico, 1s pausa, 2s bajada',
      targetSets: '3 × 10 reps',
      rir: 'RIR 2',
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
      equipment: '14 kg • Banco Plano',
      muscles: 'Tríceps (Cabeza Larga y Lateral)',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      tempoShort: '2-1-1-0',
      tempoDesc: '2s descenso tras coronilla, extensión completa',
      targetSets: '3 × 15 reps',
      rir: 'RIR 2',
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
      equipment: '14 kg • De Pie',
      muscles: 'Bíceps Braquial, Antebrazos',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      tempoShort: '3-0-1-0',
      tempoDesc: '1s subida estricta, 3s bajada excéntrica',
      targetSets: '3 × 15 reps',
      rir: 'RIR 2',
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
    },
    {
      id: 'back-squat',
      title: 'Sentadilla con Barra en Banco',
      category: 'pierna',
      equipment: '60 kg • Soportes de Banco',
      muscles: 'Cuádriceps, Glúteos, Core',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      tempoShort: '3-1-1-0',
      tempoDesc: '3s bajada lenta, 1s pausa paralela, subida',
      targetSets: '3 × 10 reps',
      rir: 'RIR 2',
      athleteNote: 'A 194 cm y 120 kg con fémures largos, necesitas un stance algo más ancho que tus hombros y puntas abiertas a 30°. Esto permite que la pelvis baje sin flexión lumbar. Mantén RIR 2 para re-enjaular seguro.',
      cues: [
        {
          title: 'Stance Ancho (Puntas a 30°)',
          desc: 'Abre los pies más allá del ancho de hombros para que tu fémur largo quepa entre las caderas.'
        },
        {
          title: 'Apertura Forzada de Rodillas',
          desc: 'Empuja activamente las rodillas hacia afuera en línea con la dirección de los dedos de los pies.'
        },
        {
          title: 'Maniobra de Valsalva',
          desc: 'Inhala hondo inflando el diafragma antes de descender para crear un cinturón de presión intratorácica.'
        },
        {
          title: 'Re-enjaulado Controlado en Soportes',
          desc: 'Termina erguido, camina hasta chocar ambos postes del soporte del banco y baja la barra.'
        }
      ],
      mistake: 'Rebotar bruscamente en el fondo. A 120 kg corporales más 60 kg de carga, el rebote castiga meniscos; la pausa controlada de 1s hipertrofia y protege.'
    },
    {
      id: 'deadlift',
      title: 'Peso Muerto con Barra',
      category: 'pierna',
      equipment: '60 kg • Desde el Suelo',
      muscles: 'Isquios, Glúteos, Espalda Baja',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      tempoShort: '1-1-2-0',
      tempoDesc: 'Tracción firme, 1s bloqueo, 2s bajada',
      targetSets: '3 × 8 reps',
      rir: 'RIR 2',
      athleteNote: 'Con 194 cm de altura, la distancia de recorrido es larga. La barra debe colocarse a 2-3 cm de tus tibias. Quita la holgura de la barra antes de despegar empujando el piso.',
      cues: [
        {
          title: 'Barra Pegada a las Tibias',
          desc: 'Si la barra se separa hacia adelante, el brazo de palanca lesiona la zona lumbar. Mantenla pegada.'
        },
        {
          title: 'Empuje de Suelo con Talones',
          desc: 'Piensa en alejar el suelo con las piernas, no en levantar la barra con la espalda baja.'
        },
        {
          title: 'Escápulas Sobre la Barra',
          desc: 'Al posicionarte, los hombros y escápulas deben quedar justo encima o milimétricamente por delante de la barra.'
        },
        {
          title: 'Bloqueo con Glúteo',
          desc: 'Al llegar arriba, aprieta los glúteos con fuerza hacia adelante. Cero arqueo de columna hacia atrás.'
        }
      ],
      mistake: 'Iniciar el levantamiento con la cadera demasiado baja tipo sentadilla o redondear la espalda dorsal en el despegue.'
    },
    {
      id: 'lunges',
      title: 'Zancadas con Barra Chica',
      category: 'pierna',
      equipment: '14 kg • Espacio Patio',
      muscles: 'Cuádriceps, Glúteo Medio',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      tempoShort: '2-0-1-0',
      tempoDesc: '2s descenso largo, empuje desde talón',
      targetSets: '3 × 12 reps',
      rir: 'RIR 2',
      athleteNote: 'El trabajo unilateral con los 14 kg descarga la compresión axial de la columna vertebral y fortalece los estabilizadores de rodilla y cadera para tus 120 kg.',
      cues: [
        {
          title: 'Paso Amplio a 90°',
          desc: 'Da un paso largo de modo que la tibia delantera quede vertical y la rodilla forme un ángulo recto.'
        },
        {
          title: 'Rodilla Trasera a 2 cm del Piso',
          desc: 'Baja en vertical con control sin impactar la rótula contra el suelo del patio.'
        },
        {
          title: 'Torso Levemente Inclinado (10°)',
          desc: 'Una suave inclinación hacia adelante carga el glúteo mayor y alivia tensión patelar.'
        },
        {
          title: 'Empuje de Talón Delantero',
          desc: 'Sube impulsando todo el peso desde la planta y el talón del pie adelantado.'
        }
      ],
      mistake: 'Caminar en "cuerda floja". Mantén los pies al ancho de tus caderas para conservar la base de equilibrio.'
    },
    {
      id: 'calf-raises',
      title: 'Elevación de Gemelos con Barra',
      category: 'pierna',
      equipment: '60 kg • Sobre Trapecios',
      muscles: 'Gastrocnemio, Sóleo, Tobillos',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      tempoShort: '2-2-1-2',
      tempoDesc: '1s subida, 2s pausa arriba, 2s bajada, 2s estiramiento',
      targetSets: '3 × 15 reps',
      rir: 'RIR 1-2',
      athleteNote: 'Tus gemelos cargan 120 kg todos los días. Para romper su adaptación y hacerlos crecer, la pausa de 2 segundos en el estiramiento profundo abajo anula el tendón elástico.',
      cues: [
        {
          title: 'Pausa de 2 Segundos Abajo',
          desc: 'Permanece en el punto de máximo estiramiento 2 segundos para anular la energía elástica del tendón de Aquiles.'
        },
        {
          title: 'Subida Sobre el Dedo Gordo',
          desc: 'Empuja concentrando la presión en el primer metatarsiano para reclutar la cabeza medial del gemelo.'
        },
        {
          title: 'Pausa de 2 Segundos Arriba',
          desc: 'Aprieta al máximo arriba antes de iniciar el descenso controlado.'
        },
        {
          title: 'Rodillas con Microflexión Fija',
          desc: 'No bloquees las rodillas rígidamente; mantenlas con un mínimo ángulo para transferir la carga al músculo.'
        }
      ],
      mistake: 'Rebotar rápido como resorte. Los gemelos crecen con pausas isométricas estrictas.'
    },
    {
      id: 'overhead-press',
      title: 'Press Militar con Barra Chica',
      category: 'hombros',
      equipment: '14 kg • De Pie',
      muscles: 'Deltoides, Tríceps, Core',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      tempoShort: '2-0-1-0',
      tempoDesc: 'Empuje vertical explosivo, 2s descenso',
      targetSets: '3 × 12 reps',
      rir: 'RIR 2',
      athleteNote: 'A 194 cm, tu palanca de empuje sobre la cabeza es muy alta. Apretar glúteos y abdomen es indispensable para evitar que la pelvis se proyecte hacia adelante.',
      cues: [
        {
          title: 'Base de Piedra (Glúteos & Core)',
          desc: 'Aprieta glúteos y cuádriceps antes de empujar para convertir tu cuerpo en un pilar sólido.'
        },
        {
          title: 'Paso de la Cabeza',
          desc: 'Inclina la barbilla levemente hacia atrás al subir la barra y pasa la cabeza hacia adelante al bloquear arriba.'
        },
        {
          title: 'Codos por Delante de la Barra',
          desc: 'Al descender a la altura de las clavículas, mantén los antebrazos perfectamente verticales.'
        },
        {
          title: 'Bloqueo en Línea con las Orejas',
          desc: 'Arriba la barra debe quedar exactamente alineada con la coronilla y las orejas.'
        }
      ],
      mistake: 'Arquear la espalda lumbar hacia atrás para convertir el ejercicio en un press de banca inclinado de pie.'
    },
    {
      id: 'close-grip-bench',
      title: 'Press de Banca Agarre Cerrado',
      category: 'brazos',
      equipment: '60 kg • Banco Plano',
      muscles: 'Tríceps, Pectoral, Deltoides Anterior',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      tempoShort: '3-1-1-0',
      tempoDesc: '3s bajada con codos pegados, subida firme',
      targetSets: '3 × 10 reps',
      rir: 'RIR 2',
      athleteNote: 'Excelente ejercicio compuesto para sobrecargar los tríceps con 60 kg de barra. El agarre no debe ser demasiado estrecho para no lesionar las muñecas.',
      cues: [
        {
          title: 'Agarre al Ancho de Hombros',
          desc: 'Separa las manos al ancho exacto de tus hombros (30-35 cm). Un agarre más cerrado lesiona muñecas.'
        },
        {
          title: 'Codos Pegados a las Costillas',
          desc: 'Desciende manteniendo los codos a 30° respecto al cuerpo para dirigir todo el estrés a los tríceps.'
        },
        {
          title: 'Toque en el Esternón Inferior',
          desc: 'Baja la barra un poco más abajo que en el press de banca normal, tocando la parte baja del pecho.'
        },
        {
          title: 'Extensión Completa sin Golpear',
          desc: 'Empuja y bloquea con la fuerza de los tríceps sin hiperextender bruscamente los codos.'
        }
      ],
      mistake: 'Juntar las manos tocándose los pulgares. Eso destruye las muñecas con 60 kg de carga.'
    }
  ]

  const filteredExercises =
    activeCategory === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === activeCategory)

  const toggleExercise = (id) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Cabecera Limpia con Contador */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            BIOMECÁNICA & EJECUCIÓN
          </span>
          <h2 className="text-2xl font-black text-white leading-tight">
            Consejos de Ejercicio
          </h2>
        </div>
        <span className="text-xs font-bold text-zinc-400">
          {filteredExercises.length} ejercicios
        </span>
      </div>

      {/* Filtros de Categoría con Blanco Protagonista */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {['all', 'pecho', 'espalda', 'pierna', 'brazos', 'hombros'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap touch-press ${
              activeCategory === cat
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'text-zinc-400 hover:text-white bg-[#212227]'
            }`}
          >
            {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de Ejercicios en Formato ACORDEÓN / PLEGADO (Scannable en 1 segundo) */}
      <div className="space-y-3">
        {filteredExercises.map((ex) => {
          const isExpanded = expandedExerciseId === ex.id

          return (
            <div
              key={ex.id}
              className={`rounded-[24px] bg-[#212227] transition-all overflow-hidden shadow-xl ${
                isExpanded ? 'ring-1 ring-white/20' : 'hover:bg-[#272830]'
              }`}
            >
              {/* CABECERA COMPACTA SIEMPRE VISIBLE (Tap para expandir/plegar) */}
              <div
                onClick={() => toggleExercise(ex.id)}
                className="p-5 cursor-pointer flex items-center justify-between gap-3 touch-press"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                      {ex.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#2C2D34] text-[10px] font-bold text-zinc-300 uppercase">
                      {ex.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-medium truncate">
                    {ex.muscles}
                  </p>

                  {/* DATOS EN FORMATO PÍLDORA (Escaneo ultrarrápido) */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {/* Píldora Carga */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1A1B20] text-white text-xs font-black">
                      <Dumbbell className="w-3.5 h-3.5 text-white" />
                      <span>{ex.equipment.split('•')[0].trim()}</span>
                    </span>

                    {/* Píldora Tempo */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1A1B20] text-white text-xs font-mono font-black">
                      <Clock className="w-3.5 h-3.5 text-white" />
                      <span>{ex.tempoShort}</span>
                    </span>

                    {/* Píldora Series/Reps */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1A1B20] text-white text-xs font-bold">
                      <Layers className="w-3.5 h-3.5 text-white" />
                      <span>{ex.targetSets}</span>
                    </span>

                    {/* Píldora RIR */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1A1B20] text-emerald-400 text-xs font-black">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ex.rir}</span>
                    </span>
                  </div>
                </div>

                {/* Botón Chevron para indicar acordeón */}
                <button
                  type="button"
                  className={`w-9 h-9 rounded-full bg-[#2C2D34] text-white flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 bg-white text-black' : ''
                  }`}
                  aria-label={isExpanded ? 'Plegar técnica' : 'Desplegar técnica'}
                >
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* CONTENIDO DESPLEGABLE (Solo si el atleta hace tap) */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-[#2C2D34] animate-fadeIn">
                  {/* Foto con Banner */}
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-[#121316]">
                    <img
                      src={ex.image}
                      alt={ex.title}
                      className="w-full h-full object-cover opacity-80"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#212227] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
                        Tempo: {ex.tempoDesc}
                      </span>
                    </div>
                  </div>

                  {/* DESTACAR LO PERSONALIZADO: Cita con borde blanco de alto contraste para Angel */}
                  {ex.athleteNote && (
                    <div className="border-l-4 border-white bg-[#1A1B20] p-4 rounded-r-2xl space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-black text-xs uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Para ti (194 cm / 120 kg):</span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed italic">
                        {ex.athleteNote}
                      </p>
                    </div>
                  )}

                  {/* PUNTOS CLAVE DE TÉCNICA */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block">
                      PUNTOS CLAVE DE TÉCNICA
                    </span>
                    <div className="space-y-2 text-xs">
                      {ex.cues.map((cue, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 font-mono shadow-sm">
                            {cIdx + 1}
                          </span>
                          <div className="leading-snug">
                            <strong className="font-extrabold text-white">{cue.title}: </strong>
                            <span className="text-zinc-300">{cue.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ERROR A EVITAR */}
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border-l-4 border-rose-500 flex items-start gap-2.5 text-xs text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-black text-white block mb-0.5">Error a evitar:</strong>
                      <span className="text-rose-200">{ex.mistake}</span>
                    </div>
                  </div>

                  {/* Botón para iniciar entrenamiento si se desea */}
                  {onStartExerciseRoutine && (
                    <button
                      type="button"
                      onClick={onStartExerciseRoutine}
                      className="w-full py-3 rounded-xl bg-white text-black font-black text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all touch-press cursor-pointer shadow-lg shadow-white/10"
                    >
                      <span>Entrenar Este Ejercicio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
