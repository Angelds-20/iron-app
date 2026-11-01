import React from 'react'
import {
  Trophy,
  Flame,
  Zap,
  ShieldCheck,
  Award,
  Dumbbell,
  TrendingUp,
  Lock,
  CheckCircle2,
  Sparkles,
  Target
} from 'lucide-react'
import { BADGES_CATALOG } from '../lib/constants'
import { calculateLevel } from '../lib/overloadEngine'

const ICON_COMPONENTS = {
  Zap,
  Flame,
  ShieldCheck,
  Award,
  Trophy,
  Dumbbell,
  TrendingUp
}

export function AchievementsView({ unlockedBadges = [], totalXp = 0, personalRecords = {}, streak = 1 }) {
  const levelInfo = calculateLevel(totalXp)
  const unlockedCodes = new Set(unlockedBadges.map((b) => b.code))

  return (
    <div className="pb-32">
      {/* Header Nivel y Rango */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              RANGO DEL ATLETA
            </span>
            <h2 className="text-2xl font-black text-carbon-900 tracking-tight mt-0.5">
              {levelInfo.title}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center border border-sand-200/60">
            <span className="text-xl font-black text-coral-500">{levelInfo.level}</span>
          </div>
        </div>

        {/* Barra de progreso de XP */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-neutral-500">
              XP Total: <span className="text-carbon-900 font-bold">{totalXp} XP</span>
            </span>
            <span className="text-coral-500 font-bold">
              +{levelInfo.xpToNext} XP para Nivel {levelInfo.level + 1}
            </span>
          </div>
          <div className="w-full h-2.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral-500 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Racha y Récords Personales (PRs) */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-coral-50 flex items-center justify-center text-coral-500">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              RACHA
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-carbon-900">{streak}</div>
            <div className="text-xs text-neutral-400 font-medium">
              {streak === 1 ? 'Sesión activa' : 'Días consecutivos'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-sand-200/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-sand-100 flex items-center justify-center text-carbon-900">
              <Trophy className="w-4 h-4 text-coral-500" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              PR BANCA
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-carbon-900">
              {personalRecords.benchPress || 45}{' '}
              <span className="text-xs font-semibold text-neutral-400">kg</span>
            </div>
            <div className="text-xs text-neutral-400 font-medium">Marca máxima</div>
          </div>
        </div>
      </div>

      {/* Catálogo de Premios e Insignias */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-200/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              GAMIFICACIÓN
            </span>
            <h3 className="text-lg font-bold text-carbon-900 tracking-tight">
              Insignias & Logros
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sand-100 text-neutral-600">
            {unlockedCodes.size} / {BADGES_CATALOG.length}
          </span>
        </div>

        <div className="space-y-3">
          {BADGES_CATALOG.map((badge) => {
            const isUnlocked = unlockedCodes.has(badge.code)
            const Icon = ICON_COMPONENTS[badge.iconName] || Trophy

            return (
              <div
                key={badge.code}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-sand-50/70 border-sand-200/80 shadow-xs'
                    : 'bg-sand-50/20 border-sand-200/30 opacity-55'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-carbon-900 text-white shadow-sm'
                      : 'bg-sand-200 text-neutral-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-carbon-900">{badge.title}</h4>
                    <span className="text-[11px] font-extrabold text-coral-500">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  {isUnlocked && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Desbloqueado</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
