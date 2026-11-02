import React from 'react'
import { LayoutGrid, Calendar, BarChart2, Sliders } from 'lucide-react'

export function Navbar({ activeTab = 'home', onSelectTab }) {
  const tabs = [
    { id: 'home', icon: LayoutGrid, label: 'Workouts' },
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
              className={`p-3 rounded-2xl transition-all duration-200 flex items-center justify-center cursor-pointer touch-press ${
                isActive
                  ? 'text-white scale-110'
                  : 'text-[#565863] hover:text-[#8E909A]'
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon className="w-6 h-6 stroke-[2.2]" />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
