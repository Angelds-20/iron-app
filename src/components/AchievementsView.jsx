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
    <div className="pb-32 text-white">
      {/* Header Nivel y Rango */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl border border-[#2C2D34] mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              RANGO DEL ATLETA
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              {levelInfo.title}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center">
            <span className="text-xl font-black text-white">{levelInfo.level}</span>
          </div>
        </div>

        {/* Barra de progreso de XP */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-zinc-400">
              XP Total: <span className="text-white font-bold">{totalXp} XP</span>
            </span>
            <span className="text-white font-black">
              +{levelInfo.xpToNext} XP para Nivel {levelInfo.level + 1}
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#1A1B20] rounded-full overflow-hidden border border-[#2C2D34]">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Racha y Récords Personales (PRs) */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#212227] rounded-[28px] p-5 shadow-xl border border-[#2C2D34] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center text-white">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">
              RACHA
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{streak}</div>
            <div className="text-xs text-zinc-400 font-medium">
              {streak === 1 ? 'Sesión activa' : 'Días consecutivos'}
            </div>
          </div>
        </div>

        <div className="bg-[#212227] rounded-[28px] p-5 shadow-xl border border-[#2C2D34] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#1A1B20] border border-[#2C2D34] flex items-center justify-center text-white">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">
              PR BANCA
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {personalRecords.benchPress || 60}{' '}
              <span className="text-xs font-normal text-zinc-400">kg</span>
            </div>
            <div className="text-xs text-zinc-400 font-medium">Marca máxima</div>
          </div>
        </div>
      </div>

      {/* Catálogo de Premios e Insignias */}
      <div className="bg-[#212227] rounded-[28px] p-6 shadow-xl border border-[#2C2D34]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              GAMIFICACIÓN
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Insignias & Logros
            </h3>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#1A1B20] border border-[#2C2D34] text-white">
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
                    ? 'bg-[#1A1B20] border-white/20 shadow-md'
                    : 'bg-[#1A1B20]/40 border-[#2C2D34] opacity-40'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-white text-black shadow-lg shadow-white/20'
                      : 'bg-[#2C2D34] text-zinc-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white">{badge.title}</h4>
                    <span className="text-[11px] font-black text-white bg-[#2C2D34] px-2 py-0.5 rounded-md">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                  {isUnlocked && (
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-black text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
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
