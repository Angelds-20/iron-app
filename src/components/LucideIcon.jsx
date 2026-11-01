import React from 'react'
import {
  Trophy,
  Flame,
  Zap,
  ShieldCheck,
  Award,
  Dumbbell,
  TrendingUp,
  Calendar,
  Check,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Info,
  Clock,
  ArrowUpRight,
  Weight,
  Target,
  BarChart3,
  Sliders,
  X,
  Activity,
  Watch,
  HeartPulse
} from 'lucide-react'

const ICON_MAP = {
  Trophy,
  Flame,
  Zap,
  ShieldCheck,
  Award,
  Dumbbell,
  TrendingUp,
  Calendar,
  Check,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Info,
  Clock,
  ArrowUpRight,
  Weight,
  Target,
  BarChart3,
  Sliders,
  X,
  Activity,
  Watch,
  HeartPulse
}

export function LucideIcon({ name, className = 'w-5 h-5', ...props }) {
  const Component = ICON_MAP[name] || Dumbbell
  return <Component className={className} {...props} />
}
