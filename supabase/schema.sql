-- ==============================================================================
-- Schema Supabase: Aura Fitness - Progressive Overload & Gamification
-- ==============================================================================

-- 1. Perfil del Usuario
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  current_weight numeric(5,2) default 77.9,
  target_weight numeric(5,2) default 75.0,
  daily_calorie_target integer default 2800,
  streak_count integer default 1,
  total_xp integer default 120,
  level integer default 1,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Entrenamientos completados
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null, -- 'Torso A', 'Pierna A', 'Torso B', 'Pierna B'
  category text not null, -- 'torso', 'pierna', 'fullbody'
  notes text,
  duration_minutes integer default 45,
  completed_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Ejercicios dentro del entrenamiento
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  name text not null,
  order_index integer default 0,
  suggested_overload text -- Sugerencia calculada de sobrecarga progresiva
);

-- 4. Series (Sets)
create table if not exists public.exercise_sets (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  set_number integer not null,
  weight_kg numeric(5,2) not null,
  reps integer not null,
  rir integer default 2, -- Repeticiones en reserva (0 a 4)
  is_pr boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. Medallas y Logros (Premios / Gamificación)
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  code text not null, -- ej: 'FIRST_SESSION', 'BENCH_60KG', 'STREAK_7'
  title text not null,
  description text not null,
  icon_name text not null, -- Lucide Icon (Trophy, Flame, Zap, Award, Target, Dumbbell)
  unlocked_at timestamptz default timezone('utc'::text, now()) not null,
  unique(user_id, code)
);

-- 6. Registro de Peso Corporal (Histórico diario)
create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight_kg numeric(5,2) not null,
  log_date date default current_date not null,
  unique(user_id, log_date)
);

-- Políticas RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_sets enable row level security;
alter table public.achievements enable row level security;
alter table public.weight_logs enable row level security;

-- Policies para perfiles
create policy "Usuarios gestionan su propio perfil" 
  on public.profiles for all using (auth.uid() = id);

-- Policies para workouts
create policy "Usuarios gestionan sus workouts" 
  on public.workouts for all using (auth.uid() = user_id);

-- Policies para ejercicios
create policy "Usuarios gestionan sus ejercicios" 
  on public.exercises for all using (
    exists (select 1 from public.workouts where workouts.id = exercises.workout_id and workouts.user_id = auth.uid())
  );

-- Policies para series
create policy "Usuarios gestionan sus series" 
  on public.exercise_sets for all using (
    exists (
      select 1 from public.exercises 
      join public.workouts on workouts.id = exercises.workout_id
      where exercises.id = exercise_sets.exercise_id and workouts.user_id = auth.uid()
    )
  );

-- Policies para medallas
create policy "Usuarios ven sus medallas" 
  on public.achievements for all using (auth.uid() = user_id);

-- Policies para peso
create policy "Usuarios gestionan su peso" 
  on public.weight_logs for all using (auth.uid() = user_id);
