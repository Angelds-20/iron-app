import React from 'react'

export function NutritionCard({
  caloriesCurrent = 0,
  caloriesTarget = 2800,
  proteinCurrent = 0,
  proteinTarget = 180,
  carbsCurrent = 0,
  carbsTarget = 300,
  fatCurrent = 0,
  fatTarget = 70
}) {
  const calPercent = Math.min(100, Math.round((caloriesCurrent / caloriesTarget) * 100))

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {/* Tarjeta Calorías */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            CALORÍAS
          </span>
        </div>

        {/* Círculo indicador */}
        <div className="flex justify-center my-3">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-sand-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-coral-500 transition-all duration-500 stroke-current"
                strokeDasharray={`${calPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-base font-extrabold text-carbon-900">
              {calPercent}%
            </span>
          </div>
        </div>

        <div>
          <div className="text-center">
            <span className="text-base font-bold text-coral-500">{caloriesCurrent}</span>
            <span className="text-neutral-400 text-sm font-semibold"> / {caloriesTarget}</span>
            <div className="text-[11px] text-neutral-400 font-medium">kcal</div>
          </div>
        </div>
      </div>

      {/* Tarjeta Macros */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between">
        {/* Proteína */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[10px] tracking-wider text-neutral-400 uppercase">PROTEÍNA</span>
            <span className="font-semibold text-carbon-800 text-[11px]">
              {proteinCurrent}g <span className="text-neutral-400 font-normal">/ {proteinTarget}g</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (proteinCurrent / proteinTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Carbohidratos */}
        <div className="my-2">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[10px] tracking-wider text-neutral-400 uppercase">CARBOS</span>
            <span className="font-semibold text-carbon-800 text-[11px]">
              {carbsCurrent}g <span className="text-neutral-400 font-normal">/ {carbsTarget}g</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-carbon-800 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (carbsCurrent / carbsTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Grasas */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-[10px] tracking-wider text-neutral-400 uppercase">GRASAS</span>
            <span className="font-semibold text-carbon-800 text-[11px]">
              {fatCurrent}g <span className="text-neutral-400 font-normal">/ {fatTarget}g</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (fatCurrent / fatTarget) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
