import { supabase, isSupabaseConfigured } from './supabaseClient'

export const ATHLETE_EMAIL = 'angel@iron.app'
export const ATHLETE_PASS = 'IronAthlete2026!'
export const ATHLETE_USER_ID = '8cf6e938-d4e3-41bb-b9c3-119ea563b60f'

/**
 * Servicio de autenticación permanente y silenciosa con Supabase
 * Conecta automáticamente a la cuenta de Ángel sin pedir credenciales ni mostrar modales
 */
export async function getInitialSession() {
  if (!isSupabaseConfigured || !supabase) return null
  try {
    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      // Auto-login transparente para el atleta Ángel
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ATHLETE_EMAIL,
        password: ATHLETE_PASS
      })
      if (!error && data?.session) {
        session = data.session
      }
    }
    return session
  } catch (err) {
    console.warn('Error al verificar sesión inicial:', err)
    return null
  }
}

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase no está configurado.' } }
  }
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email, password, fullName = '') {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase no está configurado.' } }
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })
}

export async function signOutUser() {
  if (!isSupabaseConfigured || !supabase) return { error: null }
  return await supabase.auth.signOut()
}
