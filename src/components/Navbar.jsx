import React from 'react'
import { LayoutGrid, Calendar, BarChart2, Sliders, Utensils } from 'lucide-react'

export function Navbar({ activeTab = 'home', onSelectTab }) {
  const tabs = [
    { id: 'home', icon: LayoutGrid, label: 'Workouts' },
    { id: 'nutrition', icon: Utensils, label: 'Nutrición' },
    { id: 'routines', icon: Calendar, label: 'Calendario' },
    { id: 'stats', icon: BarChart2, label: 'Estadísticas' },
    { id: 'settings', icon: Sliders, label: 'Ajustes' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-3 bg-gradient-to-t from-[#121316] via-[#121316]/95 to-transparent backdrop-blur-md pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-around max-w-[360px] w-full px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`p-2.5 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center cursor-pointer touch-press ${
                isActive
                  ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                  : 'text-zinc-500 hover:text-white'
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon className="w-6 h-6 stroke-[2.2]" />
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] mt-1 animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
