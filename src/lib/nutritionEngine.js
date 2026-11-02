// Motor de Nutrición & Macros Cero Fricción para IRON Tracker
// Diseñado para el atleta Angel (194 cm / 120 kg)
// Soporta Local-First offline instantáneo + Sincronización Supabase RPC

import { supabase, isSupabaseConfigured } from './supabaseClient'

export const DEFAULT_MEAL_PRESETS = [
  {
    id: 'preset-arroz-pollo',
    name: 'Arroz con Pollo Apanado',
    serving_label: '1 Plato Fuerte',
    calories: 750,
    protein: 45,
    carbs: 80,
    fats: 25,
    category: 'almuerzo'
  },
  {
    id: 'preset-pan-manjar',
    name: 'Pan con Manjar',
    serving_label: '1 Unidad',
    calories: 320,
    protein: 8,
    carbs: 60,
    fats: 5,
    category: 'once'
  },
  {
    id: 'preset-medio-pan-manjar',
    name: 'Medio Pan con Manjar',
    serving_label: 'Mitad',
    calories: 160,
    protein: 4,
    carbs: 30,
    fats: 2,
    category: 'snack'
  },
  {
    id: 'preset-fideos-base',
    name: 'Fideos Base (sola/salsa)',
    serving_label: '1 Plato',
    calories: 400,
    protein: 12,
    carbs: 75,
    fats: 5,
    category: 'almuerzo'
  },
  {
    id: 'preset-porotos-riendas',
    name: 'Porotos con Riendas',
    serving_label: '1 Plato Hondo',
    calories: 550,
    protein: 25,
    carbs: 90,
    fats: 8,
    category: 'almuerzo'
  },
  {
    id: 'preset-galletas-nick',
    name: 'Galletas Nick',
    serving_label: '5 Unidades',
    calories: 240,
    protein: 2,
    carbs: 35,
    fats: 10,
    category: 'snack'
  }
]

export const DEFAULT_TARGET_MACROS = {
  calories: 2800,
  protein: 180, // ~1.5g/kg para 120 kg
  carbs: 340,
  fats: 75
}

// Cargar presets de comidas guardados
export function loadMealPresets() {
  const saved = localStorage.getItem('iron_meal_presets_v1')
  if (saved) {
    try {
      const list = JSON.parse(saved)
      if (Array.isArray(list) && list.length > 0) return list
    } catch (e) {}
  }
  localStorage.setItem('iron_meal_presets_v1', JSON.stringify(DEFAULT_MEAL_PRESETS))
  return DEFAULT_MEAL_PRESETS
}

// Guardar lista de presets
export function saveMealPresets(presets) {
  localStorage.setItem('iron_meal_presets_v1', JSON.stringify(presets))
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
      // Intentar RPC log_quick_meal si existe
      await supabase.rpc('log_quick_meal', {
        preset_id: preset.id,
        multiplier
      }).catch(async () => {
        // Fallback a upsert directo en tabla daily_macros
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

// SQL Script para copiar en Supabase
export const SUPABASE_NUTRITION_SQL = `-- 1. Tabla de tus "Bloques" o Comidas Frecuentes
CREATE TABLE IF NOT EXISTS meal_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  serving_label TEXT NOT NULL, -- ej: "1 Plato", "Medio Pan"
  calories INTEGER NOT NULL,
  protein INTEGER DEFAULT 0,
  carbs INTEGER DEFAULT 0,
  fats INTEGER DEFAULT 0,
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

-- 3. Insertar tus comidas base reales
INSERT INTO meal_presets (name, serving_label, calories, protein, carbs, fats) VALUES
('Arroz con Pollo Apanado', '1 Plato Fuerte', 750, 45, 80, 25),
('Pan con Manjar', '1 Unidad', 320, 8, 60, 5),
('Medio Pan con Manjar', 'Mitad', 160, 4, 30, 2),
('Fideos Base (sola/salsa)', '1 Plato', 400, 12, 75, 5),
('Porotos con Riendas', '1 Plato Hondo', 550, 25, 90, 8),
('Galletas Nick', '5 Unidades', 240, 2, 35, 10)
ON CONFLICT DO NOTHING;

-- 4. Función RPC para sumar un bloque con 1 solo clic
CREATE OR REPLACE FUNCTION log_quick_meal(preset_id UUID, multiplier NUMERIC DEFAULT 1)
RETURNS void AS $$
DECLARE
  p_cal INTEGER; p_pro INTEGER; p_car INTEGER; p_fat INTEGER;
BEGIN
  -- Obtener los macros del preset
  SELECT calories, protein, carbs, fats INTO p_cal, p_pro, p_car, p_fat
  FROM meal_presets WHERE id = preset_id;

  -- Upsert en daily_macros
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
