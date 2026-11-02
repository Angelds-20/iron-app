// Rutinas estrictamente con el equipamiento y ejercicios seleccionados:
// - Barra principal con 60 kg
// - Barra chica con 14 kg
// - Banco plano / inclinado con soporte
// - Honor Choice Watch 2i sync

export const APP_VERSION = 'v1.4.0'

export const DEFAULT_ROUTINES = [
  {
    id: 'torso-fuerza',
    title: 'Torso — Banca & Inclinado',
    category: 'torso',
    estimatedTime: '40 min',
    intensity: 'Alta',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'Empujes pesados con banco, tracción compensatoria y tríceps con barra chica.',
    exercises: [
      {
        id: 'bench-press',
        name: 'Press de banca plano',
        equipment: 'Barra principal (60 kg) + Banco',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 60,
        defaultRir: 2,
        notes: 'Pausa de 1 segundo en el pecho. Escápulas retraídas.'
      },
      {
        id: 'incline-bench-press',
        name: 'Press inclinado',
        equipment: 'Barra principal (60 kg) + Banco',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 40,
        defaultRir: 2,
        notes: 'Inclinación de 30° - 45°. Foco en haz clavicular.'
      },
      {
        id: 'barbell-row',
        name: 'Remo con barra',
        equipment: 'Barra principal (60 kg)',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 40,
        defaultRir: 2,
        notes: 'Torso a 45°. Tracción hacia la cadera para proteger hombros.'
      },
      {
        id: 'french-press',
        name: 'Press francés',
        equipment: 'Barra chica (14 kg) en banco',
        targetSets: 3,
        targetReps: '10 - 12',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Codos cerrados apuntando al techo. Bajada controlada a la frente.'
      },
      {
        id: 'biceps-curl',
        name: 'Curl de bíceps',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '10 - 12',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Estricto sin balanceo del torso.'
      }
    ]
  },
  {
    id: 'pierna-fuerza',
    title: 'Pierna — Sentadilla & Peso Muerto',
    category: 'pierna',
    estimatedTime: '40 min',
    intensity: 'Alta',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    description: 'Sentadilla sacada desde soportes del banco y peso muerto con tus 60 kg.',
    exercises: [
      {
        id: 'back-squat',
        name: 'Sentadilla',
        equipment: 'Barra (60 kg) sacada del banco',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 50,
        defaultRir: 2,
        notes: 'Control total al bajar. RIR 2 obligatorio para re-enjaular con seguridad.'
      },
      {
        id: 'deadlift',
        name: 'Peso muerto',
        equipment: 'Barra (60 kg) desde el suelo',
        targetSets: 4,
        targetReps: '6 - 8',
        defaultWeight: 60,
        defaultRir: 2,
        notes: 'Tus 60 kg actuales. Barra pegada a tibias, empuje de suelo con piernas.'
      }
    ]
  }
]

export const BADGES_CATALOG = [
  {
    code: 'FIRST_SESSION',
    title: 'Vuelta al Ruedo',
    description: 'Completaste tu primer entrenamiento en el patio.',
    iconName: 'Zap',
    xpReward: 100
  },
  {
    code: 'WATCH_SYNC',
    title: 'Honor Watch Sincronizado',
    description: 'Registraste métricas cardíacas de tu Honor Choice Watch 2i.',
    iconName: 'Activity',
    xpReward: 100
  },
  {
    code: 'STREAK_3',
    title: 'Constancia Inicial',
    description: '3 sesiones completadas día por medio.',
    iconName: 'Flame',
    xpReward: 150
  },
  {
    code: 'STREAK_7',
    title: 'Hábito de Hierro',
    description: '7 sesiones cumplidas de forma progresiva.',
    iconName: 'ShieldCheck',
    xpReward: 300
  },
  {
    code: 'BENCH_50KG',
    title: 'Club 50 kg Banca',
    description: 'Superaste los 50 kg en press de banca plano.',
    iconName: 'Award',
    xpReward: 200
  },
  {
    code: 'MAX_WEIGHT_60KG',
    title: 'Titanio: 60 kg de Patio',
    description: 'Levantaste los 60 kg completos de tu barra.',
    iconName: 'Trophy',
    xpReward: 400
  },
  {
    code: 'VOLUME_2000KG',
    title: 'Levantador de Toneladas',
    description: 'Moviste más de 2,000 kg de volumen total en una sesión.',
    iconName: 'Dumbbell',
    xpReward: 250
  },
  {
    code: 'FUTURE_100KG_GOAL',
    title: 'Rumbo a los 100 kg',
    description: 'Dominio de peso muerto preparando la llegada de los 100 kg.',
    iconName: 'Target',
    xpReward: 350
  }
]

export const APP_IMAGES = {
  workoutCard: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  benchPress: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
}
