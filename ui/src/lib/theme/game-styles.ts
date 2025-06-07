// lib/theme/game-styles.ts
export const gameStyles = {
  cards: {
    default:
      "bg-slate-800/60 backdrop-blur-md p-6 rounded-xl border border-slate-700/50 shadow-lg",
    highlighted:
      "bg-slate-800/60 backdrop-blur-md p-6 rounded-xl border border-red-500/50 shadow-lg shadow-red-500/20",
    role: "bg-slate-800/80 backdrop-blur-md p-4 rounded-lg border border-slate-700 shadow-md",
    profile: "border-gray-700 bg-gray-900/80 backdrop-blur-sm",
    stat: "bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors duration-300",
    infoItem:
      "relative overflow-hidden rounded-lg border border-gray-700 group hover:border-red-500/50 transition-all duration-300",
    achievement: {
      unlocked: "border-yellow-500/50 bg-yellow-500/5 cursor-pointer",
      locked: "border-gray-700 opacity-60",
    },
  },
  buttons: {
    primary:
      "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md shadow-red-900/20 hover:shadow-red-900/30",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded shadow-md",
    ghost:
      "bg-transparent hover:bg-slate-800 text-white font-bold py-2 px-4 rounded",
    danger:
      "bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded shadow-md",
    gradient:
      "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-none",
    edit: "border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300",
  },
  inputs: {
    default:
      "bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500",
  },
  modals: {
    overlay: "bg-black/80 backdrop-blur-sm",
    content:
      "bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-red-900/10",
  },
  effects: {
    bloodSplatter:
      "before:absolute before:inset-0 before:bg-red-900/10 before:rounded-full before:blur-3xl",
    moonGlow:
      "before:absolute before:inset-0 before:bg-purple-900/20 before:rounded-full before:blur-3xl",
    textShadow: "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  },
  badges: {
    default: "bg-gray-800/50 text-gray-300 border-gray-700",
    win: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-none",
    loss: "text-red-400 border-red-400",
    kill: "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-none",
  },
  tabs: {
    list: "grid grid-cols-3 bg-gray-800/50 border border-gray-700 p-1 rounded-lg",
    trigger: {
      base: "rounded-md transition-all duration-300",
      active: {
        about:
          "data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/80 data-[state=active]:to-red-700/80 data-[state=active]:text-white",
        achievements:
          "data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-900/80 data-[state=active]:to-yellow-700/80 data-[state=active]:text-white",
        history:
          "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900/80 data-[state=active]:to-blue-700/80 data-[state=active]:text-white",
      },
    },
  },
  avatar: {
    container: "relative group",
    image:
      "relative rounded-full w-32 h-32 border-2 border-gray-800 shadow-lg z-10",
    glow: "absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 to-purple-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-300",
    editButton:
      "absolute bottom-0 right-0 rounded-full bg-gray-800 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20",
    levelBadge:
      "absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500 z-20",
  },
  progressBar: {
    container: "relative h-2 w-full bg-gray-800 rounded-full overflow-hidden",
    fill: "absolute h-full bg-gradient-to-r from-red-600 to-purple-600",
  },
  timeline: {
    line: "absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700",
    item: "relative pl-10",
    dot: {
      win: "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-lg",
      loss: "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 shadow-lg",
    },
    content:
      "bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-blue-500/30 transition-colors duration-300",
  },
  friends: {
    item: "flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 cursor-pointer",
    avatar: "w-10 h-10 rounded-full border border-gray-700",
    statusDot: {
      base: "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-gray-900",
    },
  },
  backgrounds: {
    page: "min-h-screen bg-[url('/moon-forest.jpg')] bg-cover bg-center bg-fixed",
    overlay:
      "min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 py-12",
    header: {
      gradient:
        "absolute inset-0 bg-gradient-to-r from-red-900/30 to-purple-900/30 mix-blend-multiply",
      fadeBottom:
        "absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent",
    },
    phases: {
      night:
        "min-h-screen bg-[url('/moon-forest.jpg')] bg-cover bg-center bg-fixed",
      day: "min-h-screen bg-[url('/sun-forest.png')] bg-cover bg-center bg-fixed",
    },
  },
};
