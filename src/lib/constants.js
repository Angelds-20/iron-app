// Rutinas estrictamente con el equipamiento y ejercicios seleccionados:
// - Barra principal con 60 kg
// - Barra chica con 14 kg
// - Banco plano / inclinado con soporte
// - Honor Choice Watch 2i sync

export const APP_VERSION = 'v1.4.0'

export const MUSCLE_SPLITS = [
  { id: 'all', label: 'Todas' },
  { id: 'torso', label: 'Torso' },
  { id: 'pierna', label: 'Pierna' },
  { id: 'push', label: 'Empuje (Push)' },
  { id: 'pull', label: 'Tirón (Pull)' },
  { id: 'fullbody', label: 'Fullbody' }
]

export const EXERCISES_CATALOG = [
  // Pecho
  {
    id: 'bench-press',
    name: 'Press de banca plano',
    category: 'pecho',
    equipment: 'Barra principal (60 kg) + Banco',
    defaultWeight: 60,
    targetSets: 3,
    targetReps: '10',
    defaultRir: 2,
    notes: 'Pausa de 1 segundo en el pecho. Escápulas retraídas.'
  },
  {
    id: 'incline-bench-press',
    name: 'Press inclinado',
    category: 'pecho',
    equipment: 'Barra principal (60 kg) + Banco',
    defaultWeight: 60,
    targetSets: 3,
    targetReps: '10 - 6',
    defaultRir: 1,
    notes: 'Inclinación en banco. 2 series x 10 reps + 1 serie x 6 reps con 60 kg.'
  },
  {
    id: 'pushups',
    name: 'Flexiones / Lastradas',
    category: 'pecho',
    equipment: 'Corporal / Disco',
    defaultWeight: 0,
    targetSets: 3,
    targetReps: '12 - 15',
    defaultRir: 2,
    notes: 'Rango completo tocando el suelo.'
  },
  {
    id: 'bench-dips',
    name: 'Fondos en banco',
    category: 'pecho',
    equipment: 'Banco de patio',
    defaultWeight: 0,
    targetSets: 3,
    targetReps: '12 - 15',
    defaultRir: 2,
    notes: 'Codos hacia atrás sin hiperextender hombros.'
  },

  // Espalda
  {
    id: 'barbell-row',
    name: 'Remo con barra (Remo al pecho)',
    category: 'espalda',
    equipment: 'Barra principal (60 kg)',
    defaultWeight: 60,
    targetSets: 3,
    targetReps: '10',
    defaultRir: 2,
    notes: 'Torso a 45°. Remo al pecho con barra de 60 kg.'
  },
  {
    id: 'deadlift',
    name: 'Peso muerto convencional',
    category: 'espalda',
    equipment: 'Barra (60 kg) desde el suelo',
    defaultWeight: 60,
    targetSets: 4,
    targetReps: '6 - 8',
    defaultRir: 2,
    notes: 'Barra pegada a tibias, empuje de suelo con piernas.'
  },
  {
    id: 'romanian-deadlift',
    name: 'Peso muerto rumano',
    category: 'espalda',
    equipment: 'Barra principal (60 kg)',
    defaultWeight: 45,
    targetSets: 3,
    targetReps: '10 - 12',
    defaultRir: 2,
    notes: 'Bisagra de cadera profunda. Tensión en isquios.'
  },

  // Pierna
  {
    id: 'back-squat',
    name: 'Sentadilla con barra',
    category: 'pierna',
    equipment: 'Barra (60 kg) sacada del banco',
    defaultWeight: 60,
    targetSets: 4,
    targetReps: '8 - 10',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Stance amplio para fémures largos (194 cm). Control excéntrico en 3s. RIR 2 obligatorio para re-enjaular con seguridad.'
  },
  {
    id: 'front-squat',
    name: 'Sentadilla frontal',
    category: 'pierna',
    equipment: 'Barra principal (60 kg)',
    defaultWeight: 50,
    targetSets: 3,
    targetReps: '8 - 10',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Codos altos y torso erguido. Maniobra de Valsalva activa.'
  },
  {
    id: 'lunges',
    name: 'Zancadas con barra chica',
    category: 'pierna',
    equipment: 'Barra chica (14 kg)',
    defaultWeight: 14,
    targetSets: 3,
    targetReps: '10 - 12',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Paso largo, rodilla trasera a 2 cm del suelo. Foco en glúteo mayor y estabilidad unilateral.'
  },
  {
    id: 'calf-raises',
    name: 'Elevación de gemelos',
    category: 'pierna',
    equipment: 'Barra principal (60 kg)',
    defaultWeight: 60,
    targetSets: 3,
    targetReps: '15',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Pausa de 2 seg en estiramiento profundo abajo para anular el tendón de Aquiles y 2 seg arriba en contracción.'
  },

  // Hombros
  {
    id: 'military-press',
    name: 'Press militar de pie',
    category: 'hombros',
    equipment: 'Barra chica (14 kg)',
    defaultWeight: 14,
    targetSets: 4,
    targetReps: '10 - 12',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Glúteos y abdomen activos. Empuje vertical estricto pasando la cabeza al extender.'
  },
  {
    id: 'upright-row',
    name: 'Remo al mentón',
    category: 'hombros',
    equipment: 'Barra chica (14 kg)',
    defaultWeight: 14,
    targetSets: 3,
    targetReps: '12',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Codos guían el movimiento hacia arriba y afuera.'
  },

  // Bíceps
  {
    id: 'biceps-curl',
    name: 'Curl de bíceps',
    category: 'biceps',
    equipment: 'Barra chica (14 kg)',
    defaultWeight: 14,
    targetSets: 3,
    targetReps: '15',
    defaultRir: 2,
    restSeconds: 90,
    notes: '3 series de 15 reps estrictas con barra chica de 14 kg. Bajada de 3s.'
  },
  {
    id: 'preacher-curl',
    name: 'Curl predicador',
    category: 'biceps',
    equipment: 'Barra chica (14 kg) en banco',
    defaultWeight: 14,
    targetSets: 3,
    targetReps: '15',
    defaultRir: 2,
    restSeconds: 90,
    notes: '3 series de 15 reps con aislamiento total en banco.'
  },
  {
    id: 'hammer-curl',
    name: 'Curl martillo',
    category: 'biceps',
    equipment: 'Barra chica (14 kg)',
    defaultWeight: 14,
    targetSets: 3,
    targetReps: '12 - 15',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Agarre neutro. Foco en braquial y antebrazo con bajada en 3s.'
  },

  // Tríceps
  {
    id: 'french-press',
    name: 'Press francés',
    category: 'triceps',
    equipment: 'Barra chica (14 kg) en banco',
    defaultWeight: 14,
    targetSets: 3,
    targetReps: '15',
    defaultRir: 2,
    restSeconds: 90,
    notes: '3 series de 15 reps con codos cerrados apuntando al techo. Descenso tras la coronilla.'
  },
  {
    id: 'close-grip-bench',
    name: 'Press de banca agarre cerrado',
    category: 'triceps',
    equipment: 'Barra principal (60 kg) + Banco',
    defaultWeight: 60,
    targetSets: 3,
    targetReps: '8 - 10',
    defaultRir: 2,
    restSeconds: 90,
    notes: 'Manos al ancho de hombros, codos pegados al torso para aislar tríceps.'
  }
]

export const DEFAULT_ROUTINES = [
  {
    id: 'torso-fuerza',
    title: 'Torso — Banca & Inclinado',
    category: 'torso',
    estimatedTime: '48 min',
    intensity: 'Alta',
    restSeconds: 90,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'Banca 60kg (10x3), Inclinado 60kg (10x2 + 1x6), Remo al pecho 60kg (10x3), Francés 14kg (15x3) y Curl 14kg (15x3). 1:30 min de descanso.',
    exercises: [
      {
        id: 'bench-press',
        name: 'Press de banca plano',
        equipment: 'Barra principal (60 kg) + Banco',
        targetSets: 3,
        targetReps: '10',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: '3 series x 10 reps con 60 kg. Pausa de 1 segundo en el pecho. Escápulas retraídas.'
      },
      {
        id: 'incline-bench-press',
        name: 'Press inclinado',
        equipment: 'Barra principal (60 kg) + Banco',
        targetSets: 3,
        targetReps: '10 - 6',
        defaultWeight: 60,
        defaultRir: 1,
        restSeconds: 90,
        notes: '2 series x 10 reps + 1 serie x 6 reps con 60 kg.'
      },
      {
        id: 'barbell-row',
        name: 'Remo con barra (Remo al pecho)',
        equipment: 'Barra principal (60 kg)',
        targetSets: 3,
        targetReps: '10',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Remo al pecho con tus 60 kg. 3 series x 10 reps.'
      },
      {
        id: 'french-press',
        name: 'Press francés',
        equipment: 'Barra chica (14 kg) en banco',
        targetSets: 3,
        targetReps: '15',
        defaultWeight: 14,
        defaultRir: 2,
        restSeconds: 90,
        notes: '3 series x 15 reps con barra chica de 14 kg. Codos cerrados.'
      },
      {
        id: 'biceps-curl',
        name: 'Curl de bíceps',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '15',
        defaultWeight: 14,
        defaultRir: 2,
        restSeconds: 90,
        notes: '3 series x 15 reps con barra chica de 14 kg.'
      }
    ]
  },
  {
    id: 'pierna-fuerza',
    title: 'Pierna — Sentadilla & Peso Muerto',
    category: 'pierna',
    estimatedTime: '45 min',
    intensity: 'Alta',
    restSeconds: 90,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    description: 'Sentadilla (60 kg) sacada del banco, Peso muerto (60 kg), Zancadas (14 kg) y Gemelos (60 kg). 1:30 min de descanso.',
    exercises: [
      {
        id: 'back-squat',
        name: 'Sentadilla con barra',
        equipment: 'Barra (60 kg) sacada del banco',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Stance amplio para fémures largos (194 cm). Control en bajada (3s). RIR 2 obligatorio para re-enjaular con seguridad.'
      },
      {
        id: 'deadlift',
        name: 'Peso muerto con barra',
        equipment: 'Barra (60 kg) desde el suelo',
        targetSets: 4,
        targetReps: '8',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Barra a 2-3 cm de tibias. Empuje de piernas contra el suelo. Bloqueo con glúteos sin arquear lumbares.'
      },
      {
        id: 'lunges',
        name: 'Zancadas con barra chica',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '10 - 12',
        defaultWeight: 14,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Paso largo, rodilla trasera a 2 cm del suelo. Foco en glúteo mayor y estabilidad unilateral.'
      },
      {
        id: 'calf-raises',
        name: 'Elevación de gemelos',
        equipment: 'Barra principal (60 kg)',
        targetSets: 3,
        targetReps: '15',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Pausa de 2 seg en estiramiento profundo abajo para anular el tendón de Aquiles y 2 seg arriba en contracción.'
      }
    ]
  },
  {
    id: 'torso-b-hombros',
    title: 'Torso B — Hombros & Espalda',
    category: 'torso',
    estimatedTime: '42 min',
    intensity: 'Alta',
    restSeconds: 90,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: 'Press militar (14 kg), Remo al pecho (60 kg), Press cerrado (60 kg), Remo al mentón (14 kg) y Curl martillo (14 kg). 1:30 min descanso.',
    exercises: [
      {
        id: 'military-press',
        name: 'Press militar de pie',
        equipment: 'Barra chica (14 kg)',
        targetSets: 4,
        targetReps: '10 - 12',
        defaultWeight: 14,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Core y glúteos apretados. Empuje vertical estricto.'
      },
      {
        id: 'barbell-row',
        name: 'Remo con barra (Remo al pecho)',
        equipment: 'Barra principal (60 kg)',
        targetSets: 3,
        targetReps: '10',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Torso a 45°. Tirón explosivo a esternón inferior y 1s de contracción escapular.'
      },
      {
        id: 'close-grip-bench',
        name: 'Press de banca agarre cerrado',
        equipment: 'Barra principal (60 kg) + Banco',
        targetSets: 3,
        targetReps: '8 - 10',
        defaultWeight: 60,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Agarre al ancho de hombros, codos cerca del tronco para aislar tríceps.'
      },
      {
        id: 'upright-row',
        name: 'Remo al mentón',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '12',
        defaultWeight: 14,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Codos liderando el movimiento hacia arriba y afuera.'
      },
      {
        id: 'hammer-curl',
        name: 'Curl martillo',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '12 - 15',
        defaultWeight: 14,
        defaultRir: 2,
        restSeconds: 90,
        notes: 'Aislamiento de braquial y antebrazos con bajada en 3s.'
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
