import React, { useState } from 'react'
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, Check, LogOut } from 'lucide-react'
import { signInWithEmail, signUpWithEmail } from '../lib/authService'

export function AuthModal({ isOpen, onClose, onAuthSuccess, onSignOut, currentSession = null }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await signUpWithEmail(email, password, fullName)
        if (error) throw error
        setSuccessMsg('Cuenta creada con éxito. Sesión iniciada.')
        if (data.session) {
          onAuthSuccess(data.session)
          onClose()
        }
      } else {
        const { data, error } = await signInWithEmail(email, password)
        if (error) throw error
        setSuccessMsg('Sesión iniciada correctamente.')
        if (data.session) {
          onAuthSuccess(data.session)
          onClose()
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl p-6 max-w-sm w-full shadow-2xl border border-sand-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-sand-100 text-neutral-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {currentSession ? (
          /* Vista de Usuario Conectado */
          <div>
            <div className="w-12 h-12 rounded-3xl bg-sand-100 flex items-center justify-center text-carbon-900 mb-3 border border-sand-200">
              <User className="w-6 h-6 text-coral-500" />
            </div>
            <h3 className="text-xl font-black text-carbon-900 tracking-tight">
              Cuenta Conectada
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Sesión activa y permanente en este dispositivo. Tus marcas y rutinas se respaldan en Supabase.
            </p>

            <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-sand-200 mb-5">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                Correo Electrónico
              </div>
              <div className="text-sm font-black text-carbon-900 truncate">
                {currentSession.user?.email || 'angel@usuario.com'}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all"
              >
                Volver a Entrenar
              </button>

              {onSignOut && (
                <button
                  type="button"
                  onClick={async () => {
                    await onSignOut()
                    onClose()
                  }}
                  className="w-full py-3 bg-white hover:bg-sand-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Vista de Iniciar Sesión / Registrarse */
          <div>
            <div className="mb-5">
              <div className="w-10 h-10 rounded-2xl bg-sand-100 flex items-center justify-center text-carbon-900 mb-3 border border-sand-200">
                <Lock className="w-5 h-5 text-coral-500" />
              </div>
              <h3 className="text-xl font-black text-carbon-900 tracking-tight">
                {isSignUp ? 'Crear Cuenta IRON' : 'Acceso Permanente'}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tus entrenamientos, récords de 60 kg y rutinas respaldados en la nube.
              </p>
            </div>

            {/* Toggle Login / Registro */}
            <div className="grid grid-cols-2 p-1 bg-sand-100 rounded-full mb-4 border border-sand-200/80">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false)
                  setErrorMsg('')
                }}
                className={`py-2 text-xs font-bold rounded-full transition-all ${
                  !isSignUp ? 'bg-white text-carbon-900 shadow-xs' : 'text-neutral-500'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true)
                  setErrorMsg('')
                }}
                className={`py-2 text-xs font-bold rounded-full transition-all ${
                  isSignUp ? 'bg-white text-carbon-900 shadow-xs' : 'text-neutral-500'
                }`}
              >
                Registrarse
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Nombre Completo
                  </label>
                  <div className="flex items-center bg-sand-100 rounded-2xl px-3.5 py-2.5 border border-sand-200">
                    <User className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Angel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-carbon-900 outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Correo Electrónico
                </label>
                <div className="flex items-center bg-sand-100 rounded-2xl px-3.5 py-2.5 border border-sand-200">
                  <Mail className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-carbon-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <div className="flex items-center bg-sand-100 rounded-2xl px-3.5 py-2.5 border border-sand-200">
                  <Lock className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-carbon-900 outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-carbon-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span>{loading ? 'Conectando...' : isSignUp ? 'Crear Cuenta' : 'Entrar a IRON'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-sand-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sesión Permanente: No se cierra al salir</span>
          </div>
        </div>
      </div>
    </div>
  )
}
