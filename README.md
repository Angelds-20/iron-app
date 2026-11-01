# Aura Fitness — Progressive Overload & Rewards Tracker

Aplicación web minimalista de entrenamiento progresivo diseñada para móvil y escritorio, inspirada en la interfaz minimalista limpia (`Minimal Fitness UI design`).

---

## 🚀 Características

* **Diseño Minimalista Estricto (Sin Emojis):** Todo el sistema visual usa iconos de alta precisión (`Lucide React`), paleta cálida arena/piedra (`#F4F3EE`), tarjetas blancas redondeadas y acento coral/naranja (`#FF5A36`).
* **Motor de Sobrecarga Progresiva:** Analiza repeticiones, peso y RIR (repeticiones en reserva) de la sesión previa para sugerir automáticamente el peso o repeticiones objetivo de la siguiente sesión.
* **Sistema de Gamificación & Premios:**
  * Niveles y Rangos de atleta (*Iniciado*, *Guerrero de Patio*, *Titán de Hierro*).
  * Barra de Experiencia (XP) acumulable.
  * Insignias desbloqueables por superar marcas personales (PR), volumen y rachas.
  * Efecto de celebración con confetti al romper marcas.
* **Equipamiento Personalizado:**
  * Barra principal de 60 kg (con soporte de banco).
  * Barra corta de 14 kg.
  * Banco plano e inclinado.
* **Persistencia Dual:**
  * **Modo Offline/Local:** Funciona al instante en `localStorage` sin necesidad de backend previo.
  * **Supabase Cloud Sync:** Esquema SQL listo (`supabase/schema.sql`) para autenticación y persistencia en la nube.
* **Listo para Deploy en Render:** Configurado con `render.yaml` y `Dockerfile` optimizado.

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev

# Compilar para producción
npm run build
```

---

## 🗄️ Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** y ejecuta el script ubicado en:
   `supabase/schema.sql`
3. Copia tus credenciales en un archivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
4. También puedes ingresarlas directamente desde la pestaña **Ajustes** dentro de la app.

---

## 🚢 Despliegue en Render

1. Sube este proyecto a tu repositorio de GitHub.
2. En Render, crea un nuevo **Static Site** o usa **Blueprint** apuntando a `render.yaml`.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
