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
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-sand-200/80 flex items-center justify-between max-w-[340px] w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative p-2.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-carbon-900 text-white shadow-sm scale-105'
                  : 'text-neutral-400 hover:text-carbon-900 hover:bg-sand-100'
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
