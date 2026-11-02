import React from 'react'
import { Home, Layers, Dumbbell, TrendingUp, Settings } from 'lucide-react'

export function Navbar({ activeTab = 'home', onSelectTab }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'routines', icon: Layers, label: 'Rutinas' },
    { id: 'workout', icon: Dumbbell, label: 'Entrenar' },
    { id: 'stats', icon: TrendingUp, label: 'Progreso' },
    { id: 'settings', icon: Settings, label: 'Ajustes' }
  ]

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-[#18181D]/90 backdrop-blur-2xl rounded-full px-4 py-2 shadow-2xl shadow-black/80 border border-white/5 flex items-center justify-between max-w-[340px] w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative p-2.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-90 ${
                isActive
                  ? 'bg-coral-500 text-white shadow-lg shadow-coral-500/40 scale-105'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
