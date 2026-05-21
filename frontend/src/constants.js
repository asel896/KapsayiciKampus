/* =========================================================================
   1. CONSTANTS & SYSTEM CONFIG (constants.js)
   ========================================================================= */

export const DEFAULT_DURATIONS = { pomodoro: 25, short: 5, long: 15 };

export const SCENES = [
  { name: "Orman",   gradient: "radial-gradient(ellipse at 30% 20%, #1a3a2a 0%, #0d1f15 50%, #060e0a 100%)", accent: "#4ade80", sym: "✦" },
  { name: "Okyanus", gradient: "radial-gradient(ellipse at 60% 10%, #0c2d48 0%, #061824 50%, #020c12 100%)", accent: "#38bdf8", sym: "◦" },
  { name: "Gece",    gradient: "radial-gradient(ellipse at 50% 0%, #1a1040 0%, #0c0820 50%, #04030e 100%)",  accent: "#a78bfa", sym: "★" },
  { name: "Şafak",   gradient: "radial-gradient(ellipse at 20% 80%, #3d1a00 0%, #1f0d00 40%, #3d2010 80%, #0a0502 100%)", accent: "#fb923c", sym: "◆" },
  { name: "Dağ",     gradient: "radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", accent: "#e2e8f0", sym: "▲" },
  { name: "Çöl",     gradient: "radial-gradient(ellipse at 70% 80%, #2d1b00 0%, #1a0f00 40%, #0d0700 100%)", accent: "#fbbf24", sym: "◇" },
];

export const BADGE_DEFS = [
  { id: "first",  icon: "🌱", name: "İlk Adım",        desc: "İlk seans tamamlandı",        task: "1 seans tamamla",             req: (s) => s >= 1,   anim: "step.json" },
  { id: "s3",     icon: "🔥", name: "Kıvılcım",        desc: "3 seans tamamlandı",          task: "Toplam 3 seans tamamla",      req: (s) => s >= 3,   anim: "fire.json" },
  { id: "s5",     icon: "🌤",  name: "Güneşli",         desc: "5 seans tamamlandı",          task: "Toplam 5 seans tamamla",      req: (s) => s >= 5,   anim: "sun.json" },
  { id: "m50",    icon: "🎯", name: "Keskin",          desc: "50 dakika odaklanıldı",       task: "50 dakika odaklanma yap",     req: (s, m) => m >= 50, anim: "target.json" },
  { id: "s10",    icon: "⚡", name: "Güç",             desc: "10 seans tamamlandı",         task: "Toplam 10 seans tamamla",     req: (s) => s >= 10,  anim: "bolt.json" },
  { id: "m150",   icon: "🏃", name: "Tempo",           desc: "150 dakika odaklanıldı",      task: "Toplam 150 dakika odaklan",   req: (s, m) => m >= 150, anim: "run.json" },
  { id: "s25",    icon: "🌟", name: "Yükselen",        desc: "25 seans tamamlandı",         task: "Toplam 25 seans tamamla",     req: (s) => s >= 25,  anim: "star.json" },
  { id: "m300",   icon: "🚀", name: "Yörünge",         desc: "300 dakika odaklanıldı",      task: "Toplam 300 dakika odaklan",   req: (s, m) => m >= 300, anim: "rocket.json" },
  { id: "s50",    icon: "🏆", name: "Efsane",          desc: "50 seans tamamlandı",         task: "Toplam 50 seans tamamla",     req: (s) => s >= 50,  anim: "trophy.json" },
  { id: "m500",   icon: "🌌", name: "Uzaylı",          desc: "500 dakika odaklanıldı",      task: "Toplam 500 dakika odaklan",   req: (s, m) => m >= 500, anim: "galaxy.json" },
  { id: "s100",   icon: "👑", name: "Pomodoro Kralı",  desc: "100 seans tamamlandı",        task: "Toplam 100 seans tamamla",    req: (s) => s >= 100, anim: "crown.json" },
  { id: "s250",   icon: "💎", name: "Zirve",           desc: "250 seans tamamlandı",        task: "Toplam 250 seans tamamla",    req: (s) => s >= 250, anim: "diamond.json" },
];

export const FRIENDS_DATA = [
  { name: "Ahmet K.",  avatar: "AK", status: "online",  sessions: 12, streak: 4  },
  { name: "Zeynep M.", avatar: "ZM", status: "focus",   sessions: 28, streak: 9  },
  { name: "Can D.",    avatar: "CD", status: "offline", sessions: 7,  streak: 1  },
  { name: "Selin A.",  avatar: "SA", status: "focus",   sessions: 41, streak: 15 },
];

export const NAV_ITEMS = [
  { id: "pomodoro", label: "Pomodoro",    icon: "⏱" },
  { id: "tasks",    label: "Görevler",    icon: "✓"  },
  { id: "stats",    label: "İstatistik",  icon: "◈"  },
  { id: "ai",       label: "AI Koç",      icon: "✧"  },
  { id: "friends",  label: "Arkadaşlar",  icon: "◎"  },
  { id: "settings", label: "Ayarlar",     icon: "⚙"  },
  { id: "badges",   label: "Rozetler",    icon: "✦"  },
];