import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Zap,
  Crown,
  Skull,
  Moon,
  Sun,
  Vote,
  Users,
  Eye,
  Shield,
  Crosshair,
  Heart,
  Baby,
  Scale,
  Clock,
  UserX,
  Swords,
  Target,
  Activity,
  Bell,
  Star,
  Award,
  Flame,
  Sparkles,
  Wand2,
  Scroll,
  Hourglass,
} from "lucide-react"

export const NotificationIcons = {
  // Basic notification types
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,

  // Game phase icons
  phase: Zap,
  night: Moon,
  day: Sun,
  voting: Vote,
  results: Scroll,

  // Role icons
  role: Crown,
  villager: Users,
  werewolf: Eye,
  seer: Eye,
  doctor: Shield,
  hunter: Crosshair,
  witch: Wand2,
  "little-girl": Baby,
  cupid: Heart,
  lover: Heart,

  // Game action icons
  elimination: Skull,
  vote: Vote,
  action: Zap,
  ability: Sparkles,
  protection: Shield,
  investigation: Eye,
  attack: Swords,
  heal: Heart,
  kill: Skull,

  // System icons
  timer: Clock,
  countdown: Hourglass,
  player: Users,
  target: Target,
  activity: Activity,
  notification: Bell,
  achievement: Award,
  special: Star,
  magic: Wand2,
  balance: Scale,
  fire: Flame,

  // Status icons
  alive: Heart,
  dead: Skull,
  revealed: Eye,
  hidden: UserX,
} as const

export type NotificationIconType = keyof typeof NotificationIcons

export function getNotificationIcon(iconType: NotificationIconType | string, className?: string) {
  const IconComponent = NotificationIcons[iconType as NotificationIconType] || Info
  return <IconComponent className={className} />
}

// Predefined icon configurations for common notification scenarios
export const NotificationIconConfigs = {
  roleReveal: {
    icon: "role" as NotificationIconType,
    className: "h-6 w-6 text-blue-400",
  },
  phaseChange: {
    icon: "phase" as NotificationIconType,
    className: "h-6 w-6 text-purple-400",
  },
  nightFalls: {
    icon: "night" as NotificationIconType,
    className: "h-6 w-6 text-indigo-400",
  },
  dayBreaks: {
    icon: "day" as NotificationIconType,
    className: "h-6 w-6 text-yellow-400",
  },
  votingPhase: {
    icon: "voting" as NotificationIconType,
    className: "h-6 w-6 text-orange-400",
  },
  elimination: {
    icon: "elimination" as NotificationIconType,
    className: "h-6 w-6 text-red-400",
  },
  actionComplete: {
    icon: "ability" as NotificationIconType,
    className: "h-6 w-6 text-green-400",
  },
  voteCast: {
    icon: "vote" as NotificationIconType,
    className: "h-6 w-6 text-blue-400",
  },
  noElimination: {
    icon: "balance" as NotificationIconType,
    className: "h-6 w-6 text-gray-400",
  },
  timer: {
    icon: "timer" as NotificationIconType,
    className: "h-6 w-6 text-slate-400",
  },
}
