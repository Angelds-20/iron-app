// Sintetizador Web Audio API para alertas de descanso (Sin dependencias externas)
let audioCtx = null

export function initAudio() {
  if (typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
  } catch (err) {
    console.warn('No se pudo inicializar AudioContext:', err)
  }
}

export function playTimerDoneSound() {
  try {
    initAudio()
    if (!audioCtx) return

    const now = audioCtx.currentTime

    const playBeep = (time, freq, duration) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, time)

      // Curva de volumen suave para no saturar parlantes de iPhone
      gain.gain.setValueAtTime(0.4, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration)

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start(time)
      osc.stop(time + duration)
    }

    // 3 tonos de cronómetro de gimnasio profesional (Beep - Beep - Beep largo)
    playBeep(now, 880, 0.12)        // A5
    playBeep(now + 0.18, 880, 0.12) // A5
    playBeep(now + 0.36, 1760, 0.4) // A6 (agudo final)

    // Vibración háptica en iPhone / Android
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150, 80, 300])
    }
  } catch (err) {
    console.warn('Error al reproducir sonido del temporizador:', err)
  }
}
