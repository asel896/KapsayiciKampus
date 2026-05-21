import React from 'react';

// Süre formatlama fonksiyonu (Negatif süre korumalı)
export const fmt = s => {
  const safeS = Math.max(0, s);
  return `${String(Math.floor(safeS / 60)).padStart(2, "0")}:${String(safeS % 60).padStart(2, "0")}`;
};

// Arka plan parçacık bileşeni
export function Particle({ accent, sym, i }) {
  return (
    <span style={{
      position: "absolute", pointerEvents: "none", userSelect: "none",
      left: `${10 + ((i * 23) % 80)}%`, top: `${5 + ((i * 17) % 85)}%`,
      fontSize: `${7 + (i % 3) * 5}px`, color: accent,
      opacity: 0.06 + (i % 5) * 0.03,
      animation: `pf${i % 3} ${7 + (i % 4) * 2}s ease-in-out infinite`,
      animationDelay: `${(i * 0.7) % 5}s`,
    }}>{sym}</span>
  );
}

// Pomodoro dairesel ilerleme çubuğu (NaN ve tanımsız progress korumalı)
export function Ring({ progress, color, size = 272, children }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const currentProgress = typeof progress === 'number' ? progress : 0;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={c} strokeDashoffset={c * (1 - currentProgress)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.8s ease" }} />
      </svg>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>{children}</div>
    </div>
  );
}

// Sayfa başlık bileşeni
export function PageTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "white", fontStyle: "italic" }}>{children}</div>
      {sub && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// Kart (Cam efekti taşıyıcı) bileşeni
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18, padding: "18px 20px",
      marginBottom: 14, ...style,
    }}>{children}</div>
  );
}

// Küçük başlık/etiket bileşeni
export function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>{children}</div>;
}