import { supabase, isSupabaseConfigured } from './supabaseClient'

/**
 * Servicio de autenticación permanente con Supabase
 */
export async function getInitialSession() {
  if (!isSupabaseConfigured || !supabase) return null
  try {
    const { data: { session } } = await supabase.auth.getSession()
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
