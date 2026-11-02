// Motor de Nutrición & Macros Cero Fricción para IRON Tracker
// Base de Comidas Chilenas Reales para el atleta Angel (194 cm / 120 kg)
// Cero estrés: Bloques aproximados sin pesar cada gramo

import { supabase, isSupabaseConfigured } from './supabaseClient'

export const DEFAULT_MEAL_PRESETS = [
  // --- 1. ALMUERZOS Y PLATOS CASEROS CHILENOS ---
  {
    id: 'preset-porotos-riendas',
    name: 'Porotos con Riendas',
    serving_label: '1 Plato Hondo',
    calories: 580,
    protein: 26,
    carbs: 90,
    fats: 12,
    category: 'almuerzo'
  },
  {
    id: 'preset-arroz-pollo',
    name: 'Arroz con Pollo o Bistec',
    serving_label: '1 Plato Fuerte',
    calories: 720,
    protein: 45,
    carbs: 75,
    fats: 22,
    category: 'almuerzo'
  },
  {
    id: 'preset-cazuela',
    name: 'Cazuela de Vacuno o Pollo',
    serving_label: '1 Plato con choclo y carne',
    calories: 480,
    protein: 36,
    carbs: 42,
    fats: 16,
    category: 'almuerzo'
  },
  {
    id: 'preset-fideos-salsa',
    name: 'Fideos con Salsa / Tuco',
    serving_label: '1 Plato de tallarines',
    calories: 520,
    protein: 24,
    carbs: 78,
    fats: 12,
    category: 'almuerzo'
  },
  {
    id: 'preset-charquican',
    name: 'Charquicán con Huevo Frito',
    serving_label: '1 Plato con huevo montado',
    calories: 540,
    protein: 28,
    carbs: 52,
    fats: 22,
    category: 'almuerzo'
  },
  {
    id: 'preset-pastel-choclo',
    name: 'Pastel de Choclo / Papa',
    serving_label: '1 Paila o porción generosa',
    calories: 680,
    protein: 32,
    carbs: 68,
    fats: 28,
    category: 'almuerzo'
  },
  {
    id: 'preset-lentejas',
    name: 'Lentejas Caseras con Arroz',
    serving_label: '1 Plato Hondo',
    calories: 490,
    protein: 25,
    carbs: 82,
    fats: 8,
    category: 'almuerzo'
  },
  {
    id: 'preset-pure-bistec',
    name: 'Puré con Bistec o Vienesas',
    serving_label: '1 Plato',
    calories: 640,
    protein: 30,
    carbs: 62,
    fats: 28,
    category: 'almuerzo'
  },

  // --- 2. LA ONCE Y DESAYUNO CHILENO ---
  {
    id: 'preset-marraqueta-palta',
    name: 'Marraqueta con Palta',
    serving_label: '1 Pan entero (2 batidas)',
    calories: 380,
    protein: 9,
    carbs: 56,
    fats: 14,
    category: 'once'
  },
  {
    id: 'preset-marraqueta-queso-jamon',
    name: 'Marraqueta Queso & Jamón',
    serving_label: '1 Pan con gauda y jamón',
    calories: 450,
    protein: 24,
    carbs: 54,
    fats: 16,
    category: 'once'
  },
  {
    id: 'preset-marraqueta-huevo',
    name: 'Marraqueta con Huevos',
    serving_label: '1 Pan con 2 huevos revueltos',
    calories: 410,
    protein: 20,
    carbs: 54,
    fats: 14,
    category: 'once'
  },
  {
    id: 'preset-pan-manjar',
    name: 'Pan con Manjar o Mermelada',
    serving_label: '1 Pan con manjar Colún',
    calories: 350,
    protein: 8,
    carbs: 68,
    fats: 5,
    category: 'once'
  },

  // --- 3. ANTOJOS, CALLE Y SNACKS ---
  {
    id: 'preset-completo-italiano',
    name: 'Completo Italiano',
    serving_label: '1 Completo con vienesa, palta y mayo',
    calories: 530,
    protein: 16,
    carbs: 46,
    fats: 30,
    category: 'antojo'
  },
  {
    id: 'preset-empanada-pino',
    name: 'Empanada de Pino al Horno',
    serving_label: '1 Empanada tradicional',
    calories: 520,
    protein: 22,
    carbs: 56,
    fats: 22,
    category: 'antojo'
  },
  {
    id: 'preset-galletas-nick',
    name: 'Galletas Nick o Tritón',
    serving_label: '1 Paquete chico / 5 unidades',
    calories: 250,
    protein: 3,
    carbs: 36,
    fats: 10,
    category: 'antojo'
  },
  {
    id: 'preset-yogur-avena',
    name: 'Yogur con Avena o Plátano',
    serving_label: '1 Tazón de yogur con avena',
    calories: 290,
    protein: 15,
    carbs: 48,
    fats: 5,
    category: 'antojo'
  }
]

export const DEFAULT_TARGET_MACROS = {
  calories: 2800,
  protein: 180, // ~1.5g/kg para 120 kg
  carbs: 340,
  fats: 75
}

// Categorías disponibles
export const MEAL_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'almuerzo', label: 'Platos & Almuerzo' },
  { id: 'once', label: 'La Once & Desayuno' },
  { id: 'antojo', label: 'Antojos & Snacks' }
]

// Cargar presets de comidas guardados (con migración forzada a base chilena v2)
export function loadMealPresets() {
  const savedV2 = localStorage.getItem('iron_meal_presets_v2')
  if (savedV2) {
    try {
      const list = JSON.parse(savedV2)
      // Si la lista guardada tiene al menos 12 comidas y no tiene el medio pan viejo, usarla
      if (Array.isArray(list) && list.length >= 12 && !list.some((p) => p.id === 'preset-medio-pan-manjar')) {
        return list
      }
    } catch (e) {}
  }
  // Limpiar clave obsoleta si existía y sembrar las 16 comidas chilenas
  localStorage.removeItem('iron_meal_presets_v1')
  localStorage.setItem('iron_meal_presets_v2', JSON.stringify(DEFAULT_MEAL_PRESETS))
  return DEFAULT_MEAL_PRESETS
}

// Guardar lista de presets
export function saveMealPresets(presets) {
  localStorage.setItem('iron_meal_presets_v2', JSON.stringify(presets))
}

// Cargar objetivos de macros
export function loadTargetMacros() {
  const saved = localStorage.getItem('iron_target_macros_v1')
  if (saved) {
    try {
      return { ...DEFAULT_TARGET_MACROS, ...JSON.parse(saved) }
    } catch (e) {}
  }
  return DEFAULT_TARGET_MACROS
}

export function saveTargetMacros(targets) {
  localStorage.setItem('iron_target_macros_v1', JSON.stringify(targets))
}

// Cargar registro de macros de hoy
export function loadTodayMacros(dateStr = new Date().toISOString().split('T')[0]) {
  const saved = localStorage.getItem(`iron_macros_${dateStr}`)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {}
  }
  return {
    date: dateStr,
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fats: 0,
    logs: [] // Lista de eventos: { id, presetId, name, calories, protein, carbs, fats, timestamp, multiplier }
  }
}

// Guardar macros del día
export function saveTodayMacros(macrosData) {
  if (!macrosData?.date) return
  localStorage.setItem(`iron_macros_${macrosData.date}`, JSON.stringify(macrosData))
}

// Registrar comida rápida (Quick Add)
export async function logQuickMealLocalAndRemote(preset, multiplier = 1, dateStr = new Date().toISOString().split('T')[0]) {
  const current = loadTodayMacros(dateStr)

  const addedCal = Math.round(preset.calories * multiplier)
  const addedPro = Math.round((preset.protein || 0) * multiplier)
  const addedCar = Math.round((preset.carbs || 0) * multiplier)
  const addedFat = Math.round((preset.fats || 0) * multiplier)

  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    presetId: preset.id,
    name: preset.name,
    serving_label: preset.serving_label,
    calories: addedCal,
    protein: addedPro,
    carbs: addedCar,
    fats: addedFat,
    multiplier,
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  }

  const updated = {
    ...current,
    total_calories: current.total_calories + addedCal,
    total_protein: current.total_protein + addedPro,
    total_carbs: current.total_carbs + addedCar,
    total_fats: current.total_fats + addedFat,
    logs: [logEntry, ...(current.logs || [])]
  }

  saveTodayMacros(updated)

  // Sincronización Supabase asíncrona en segundo plano si está configurado
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc('log_quick_meal', {
        preset_id: preset.id,
        multiplier
      }).catch(async () => {
        await supabase.from('daily_macros').upsert({
          date: dateStr,
          total_calories: updated.total_calories,
          total_protein: updated.total_protein,
          total_carbs: updated.total_carbs,
          total_fats: updated.total_fats
        })
      })
    } catch (err) {
      console.warn('Supabase offline o tabla no creada aún; guardado en Local-First:', err)
    }
  }

  return updated
}

// Deshacer el último registro o eliminar un registro específico
export function removeMealLog(logId, dateStr = new Date().toISOString().split('T')[0]) {
  const current = loadTodayMacros(dateStr)
  const entryToRemove = current.logs?.find((l) => l.id === logId)
  if (!entryToRemove) return current

  const updated = {
    ...current,
    total_calories: Math.max(0, current.total_calories - entryToRemove.calories),
    total_protein: Math.max(0, current.total_protein - entryToRemove.protein),
    total_carbs: Math.max(0, current.total_carbs - entryToRemove.carbs),
    total_fats: Math.max(0, current.total_fats - entryToRemove.fats),
    logs: current.logs.filter((l) => l.id !== logId)
  }

  saveTodayMacros(updated)
  return updated
}

// SQL Script para copiar en Supabase con comidas chilenas
export const SUPABASE_NUTRITION_SQL = `-- 1. Tabla de tus "Bloques" o Comidas Frecuentes Chilenas
CREATE TABLE IF NOT EXISTS meal_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  serving_label TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER DEFAULT 0,
  carbs INTEGER DEFAULT 0,
  fats INTEGER DEFAULT 0,
  category TEXT DEFAULT 'almuerzo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla de tu Total Diario (Se actualiza sola, sin historial basura)
CREATE TABLE IF NOT EXISTS daily_macros (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  total_calories INTEGER DEFAULT 0,
  total_protein INTEGER DEFAULT 0,
  total_carbs INTEGER DEFAULT 0,
  total_fats INTEGER DEFAULT 0
);

-- 3. Base de comidas caseras y la once chilena
INSERT INTO meal_presets (name, serving_label, calories, protein, carbs, fats, category) VALUES
('Porotos con Riendas', '1 Plato Hondo', 580, 26, 90, 12, 'almuerzo'),
('Arroz con Pollo o Bistec', '1 Plato Fuerte', 720, 45, 75, 22, 'almuerzo'),
('Cazuela de Vacuno o Pollo', '1 Plato con choclo y carne', 480, 36, 42, 16, 'almuerzo'),
('Fideos con Salsa / Tuco', '1 Plato de tallarines', 520, 24, 78, 12, 'almuerzo'),
('Charquicán con Huevo Frito', '1 Plato con huevo montado', 540, 28, 52, 22, 'almuerzo'),
('Pastel de Choclo / Papa', '1 Paila o porción generosa', 680, 32, 68, 28, 'almuerzo'),
('Lentejas Caseras con Arroz', '1 Plato Hondo', 490, 25, 82, 8, 'almuerzo'),
('Puré con Bistec o Vienesas', '1 Plato', 640, 30, 62, 28, 'almuerzo'),
('Marraqueta con Palta', '1 Pan entero (2 batidas)', 380, 9, 56, 14, 'once'),
('Marraqueta Queso & Jamón', '1 Pan con gauda y jamón', 450, 24, 54, 16, 'once'),
('Marraqueta con Huevos', '1 Pan con 2 huevos revueltos', 410, 20, 54, 14, 'once'),
('Pan con Manjar o Mermelada', '1 Pan con manjar Colún', 350, 8, 68, 5, 'once'),
('Completo Italiano', '1 Completo con vienesa, palta y mayo', 530, 16, 46, 30, 'antojo'),
('Empanada de Pino al Horno', '1 Empanada tradicional', 520, 22, 56, 22, 'antojo'),
('Galletas Nick o Tritón', '1 Paquete chico / 5 un.', 250, 3, 36, 10, 'antojo'),
('Yogur con Avena o Plátano', '1 Tazón de yogur con avena', 290, 15, 48, 5, 'antojo')
ON CONFLICT DO NOTHING;

-- 4. Función RPC para sumar un bloque con 1 solo clic
CREATE OR REPLACE FUNCTION log_quick_meal(preset_id UUID, multiplier NUMERIC DEFAULT 1)
RETURNS void AS $$
DECLARE
  p_cal INTEGER; p_pro INTEGER; p_car INTEGER; p_fat INTEGER;
BEGIN
  SELECT calories, protein, carbs, fats INTO p_cal, p_pro, p_car, p_fat
  FROM meal_presets WHERE id = preset_id;

  INSERT INTO daily_macros (date, total_calories, total_protein, total_carbs, total_fats)
  VALUES (CURRENT_DATE, p_cal * multiplier, p_pro * multiplier, p_car * multiplier, p_fat * multiplier)
  ON CONFLICT (date) DO UPDATE SET
    total_calories = daily_macros.total_calories + EXCLUDED.total_calories,
    total_protein = daily_macros.total_protein + EXCLUDED.total_protein,
    total_carbs = daily_macros.total_carbs + EXCLUDED.total_carbs,
    total_fats = daily_macros.total_fats + EXCLUDED.total_fats;
END;
$$ LANGUAGE plpgsql;
`
