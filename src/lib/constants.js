// Rutinas predeterminadas basadas en el equipamiento de Angel:
// - Barra principal con hasta 60 kg
// - Barra chica con 14 kg
// - Banco plano / inclinado

export const DEFAULT_ROUTINES = [
  {
    id: 'torso-a',
    title: 'Torso A — Fuerza & Pecho',
    category: 'torso',
    estimatedTime: '45 min',
    intensity: 'Alta',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'Enfoque en empujes pesados con barra principal y balance de tracciones.',
    exercises: [
      {
        id: 'bench-press',
        name: 'Press de banca plano',
        equipment: 'Barra 60 kg + Banco',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 45,
        defaultRir: 2,
        notes: 'Pausa de 1 segundo en el pecho antes de empujar. Mantén escápulas retraídas.'
      },
      {
        id: 'barbell-row',
        name: 'Remo con barra (45°)',
        equipment: 'Barra principal',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 40,
        defaultRir: 2,
        notes: 'Tracciona hacia la cadera baja. Espalda recta y core firme.'
      },
      {
        id: 'overhead-press',
        name: 'Press militar de pie',
        equipment: 'Barra principal o chica',
        targetSets: 3,
        targetReps: '10',
        defaultWeight: 25,
        defaultRir: 2,
        notes: 'Core apretado y glúteos contraídos para no arquear la zona lumbar.'
      },
      {
        id: 'french-press',
        name: 'Press francés en banco',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '12',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Codos cerrados apuntando al techo. Baja controlado hacia la frente.'
      },
      {
        id: 'biceps-curl',
        name: 'Curl de bíceps estricto',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '12',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Sin balanceo del torso. 2 segundos de bajada excéntrica.'
      }
    ]
  },
  {
    id: 'pierna-a',
    title: 'Pierna A — Cuádriceps & Isquios',
    category: 'pierna',
    estimatedTime: '40 min',
    intensity: 'Alta',
    image: 'https://images.unsplash.com/photo-1434682881908-b0780bc3d77d?auto=format&fit=crop&w=800&q=80',
    description: 'Sentadilla sacada desde soporte de banco y trabajo de cadena posterior.',
    exercises: [
      {
        id: 'back-squat',
        name: 'Sentadilla trasera / frontal',
        equipment: 'Barra 60 kg + Soporte',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 50,
        defaultRir: 2,
        notes: 'Control total en la bajada. Nunca vayas al fallo para re-enjaular con seguridad.'
      },
      {
        id: 'romanian-deadlift',
        name: 'Peso muerto rumano (RDL)',
        equipment: 'Barra principal',
        targetSets: 4,
        targetReps: '10 - 12',
        defaultWeight: 50,
        defaultRir: 2,
        notes: 'Tempo 3 segundos bajando. Empuja la cadera hacia atrás sintiendo los isquiotibiales.'
      },
      {
        id: 'walking-lunges',
        name: 'Estocadas / Zancadas',
        equipment: 'Barra chica o discos',
        targetSets: 3,
        targetReps: '10 / pierna',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Paso largo, torso erguido. Rodilla trasera casi toca el suelo.'
      },
      {
        id: 'calf-raises',
        name: 'Elevación de talones',
        equipment: 'Barra o peso corporal',
        targetSets: 4,
        targetReps: '15',
        defaultWeight: 30,
        defaultRir: 1,
        notes: 'Pausa de 2 segundos en contracción máxima arriba.'
      }
    ]
  },
  {
    id: 'torso-b',
    title: 'Torso B — Inclinado & Detalle',
    category: 'torso',
    estimatedTime: '45 min',
    intensity: 'Media',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: 'Enfoque en porción clavicular del pectoral, deltoides y tríceps.',
    exercises: [
      {
        id: 'incline-bench-press',
        name: 'Press de banca inclinado',
        equipment: 'Barra principal + Banco inclinado',
        targetSets: 4,
        targetReps: '8 - 10',
        defaultWeight: 40,
        defaultRir: 2,
        notes: 'Inclinación de 30° a 45°. Foco en pecho superior.'
      },
      {
        id: 'close-grip-bench',
        name: 'Press cerrado o Fondos en banco',
        equipment: 'Barra principal / Banco',
        targetSets: 3,
        targetReps: '10 - 12',
        defaultWeight: 35,
        defaultRir: 2,
        notes: 'Agarre a la anchura de hombros. Énfasis brutal en tríceps.'
      },
      {
        id: 'barbell-row-wide',
        name: 'Remo pendlay / abierto',
        equipment: 'Barra principal',
        targetSets: 4,
        targetReps: '10',
        defaultWeight: 35,
        defaultRir: 2,
        notes: 'Tracción explosiva y descenso controlado.'
      },
      {
        id: 'french-press-incline',
        name: 'Press francés inclinado',
        equipment: 'Barra chica (14 kg)',
        targetSets: 3,
        targetReps: '12 - 15',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Mayor estiramiento de la porción larga del tríceps.'
      },
      {
        id: 'lateral-raises',
        name: 'Elevaciones laterales',
        equipment: 'Discos chicos',
        targetSets: 3,
        targetReps: '15',
        defaultWeight: 5,
        defaultRir: 1,
        notes: 'Brazos semi-flexionados, liderando con los codos.'
      }
    ]
  },
  {
    id: 'pierna-b',
    title: 'Pierna B — Peso Muerto & Glúteo',
    category: 'pierna',
    estimatedTime: '40 min',
    intensity: 'Alta',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    description: 'Peso muerto con 60 kg controlados y sentadillas búlgaras.',
    exercises: [
      {
        id: 'deadlift',
        name: 'Peso muerto convencional',
        equipment: 'Barra principal (60 kg)',
        targetSets: 4,
        targetReps: '6 - 8',
        defaultWeight: 60,
        defaultRir: 2,
        notes: 'Barra pegada a las espinillas. Espalda neutra, bloqueo firme de cadera arriba.'
      },
      {
        id: 'bulgarian-split-squat',
        name: 'Sentadilla búlgara en banco',
        equipment: 'Pie en banco + Barra chica',
        targetSets: 3,
        targetReps: '10 / pierna',
        defaultWeight: 14,
        defaultRir: 2,
        notes: 'Inclinación leve hacia adelante para activar glúteo y cuádriceps.'
      },
      {
        id: 'hip-thrust',
        name: 'Hip Thrust con barra en banco',
        equipment: 'Barra principal + Banco',
        targetSets: 4,
        targetReps: '10 - 12',
        defaultWeight: 50,
        defaultRir: 2,
        notes: 'Pausa de 2 segundos arriba apretando glúteos fuertemente.'
      },
      {
        id: 'plank-abs',
        name: 'Plancha abdominal isométrica',
        equipment: 'Suelo / Colchoneta',
        targetSets: 3,
        targetReps: '45 seg',
        defaultWeight: 0,
        defaultRir: 1,
        notes: 'Retroversión pélvica activa, ombligo hacia la columna.'
      }
    ]
  }
]

export const BADGES_CATALOG = [
  {
    code: 'FIRST_SESSION',
    title: 'Vuelta al Ruedo',
    description: 'Completaste tu primer entrenamiento con éxito.',
    iconName: 'Zap',
    xpReward: 100,
    category: 'progreso'
  },
  {
    code: 'STREAK_3',
    title: 'Constancia Inicial',
    description: '3 sesiones completadas con descanso inteligente.',
    iconName: 'Flame',
    xpReward: 150,
    category: 'racha'
  },
  {
    code: 'STREAK_7',
    title: 'Hábito de Acero',
    description: '7 sesiones cumplidas de forma progresiva.',
    iconName: 'ShieldCheck',
    xpReward: 300,
    category: 'racha'
  },
  {
    code: 'BENCH_50KG',
    title: 'Club 50 kg Banca',
    description: 'Superaste los 50 kg en press de banca plano.',
    iconName: 'Award',
    xpReward: 200,
    category: 'fuerza'
  },
  {
    code: 'MAX_WEIGHT_60KG',
    title: 'Titanio: Carga Máxima 60 kg',
    description: 'Exprimiste los 60 kg completos de tu barra principal.',
    iconName: 'Trophy',
    xpReward: 400,
    category: 'fuerza'
  },
  {
    code: 'VOLUME_2000KG',
    title: 'Levantador de Toneladas',
    description: 'Moviste más de 2,000 kg de volumen total en una sesión.',
    iconName: 'Dumbbell',
    xpReward: 250,
    category: 'volumen'
  },
  {
    code: 'OVERLOAD_MASTER',
    title: 'Sobrecarga Progresiva',
    description: 'Superaste el peso o repeticiones de la sesión anterior.',
    iconName: 'TrendingUp',
    xpReward: 200,
    category: 'sobrecarga'
  }
]

export const APP_IMAGES = {
  workoutCard: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  mealsCard: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  benchPress: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  profileAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
}
