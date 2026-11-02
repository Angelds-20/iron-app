import React from 'react'
import { Trophy, Target, Award, Dumbbell } from 'lucide-react'

export function PRBoardCard({ personalRecordsList = [] }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-sand-200/80 space-y-3.5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            RÉCORDS AUDITADOS
          </span>
          <h3 className="text-base font-black text-carbon-900 leading-tight mt-0.5">
            Marcas Personales (PRs)
          </h3>
        </div>

        <div className="w-8 h-8 rounded-xl bg-sand-100 flex items-center justify-center text-coral-500">
          <Trophy className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {personalRecordsList.map((pr) => (
          <div
            key={pr.id}
            className="p-3 rounded-2xl bg-sand-50 border border-sand-200/60 flex items-center justify-between group hover:border-carbon-900 transition-colors"
          >
            <div>
              <div className="text-xs font-black text-carbon-900 flex items-center gap-1.5">
                <span>{pr.name}</span>
                {pr.weight >= 60 && (
                  <span className="text-[9px] font-black text-coral-600 bg-coral-50 px-1.5 py-0.5 rounded-md">
                    PATIO MAX
                  </span>
                )}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5 font-medium">
                {pr.equipment} • 1RM Est: {pr.estimated1RM} kg
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-base font-black text-carbon-900 font-mono leading-none">
                {pr.weight}{' '}
                <span className="text-[10px] font-bold text-neutral-400">{pr.unit}</span>
              </div>
              <div className="text-[9px] font-bold text-neutral-400 mt-0.5">
                Meta: {pr.targetWeight} kg
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
