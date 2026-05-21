import React, { useState, useMemo } from "react";
import { PageTitle, Card, SectionLabel } from "../components/CommonUI/CommonUI";
import { useGlobal } from "../context/GlobalContext";
import "./StatsPage.css";

export default function StatsPage({ scene }) {
  const { sessions = [] } = useGlobal();
  const [range, setRange] = useState("week");

  const parseDate = (d) => {
    if (!d) return new Date();
    const p = d.split(".");
    if (p.length !== 3) return new Date(d);
    return new Date(+p[2], +p[1] - 1, +p[0]);
  };

  const now = new Date();

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const diff = now - parseDate(s.date);
      if (range === "week") return diff <= 7 * 86400000;
      if (range === "month") return diff <= 30 * 86400000;
      return true;
    });
  }, [sessions, range]);

  const totalMins = filtered.reduce((a, s) => a + (s.duration || 25), 0);
  const totalSess = filtered.length;
  const totalHours = (totalMins / 60).toFixed(1);
  const totalXP = totalMins * 2 + totalSess * 15;
  const level = Math.floor(totalXP / 500) + 1;
  const levelProgress = ((totalXP % 500) / 500) * 100;

  const bestStreak = (() => {
    let max = 0;
    let cur = 0;

    const dates = [...new Set(sessions.map((s) => s.date))].sort(
      (a, b) => parseDate(a) - parseDate(b)
    );

    dates.forEach((d, i) => {
      if (i === 0) cur = 1;
      else {
        const diff =
          (parseDate(d) - parseDate(dates[i - 1])) / 86400000;
        cur = diff <= 1.1 ? cur + 1 : 1;
      }
      max = Math.max(max, cur);
    });

    return max;
  })();

  const days7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const label = ["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"][d.getDay()];
    const str = d.toLocaleDateString("tr-TR");
    const count = sessions.filter((s) => s.date === str).length;
    return { label, count };
  });

  const maxBar = Math.max(...days7.map((d) => d.count), 1);

  const productivityScore = Math.min(
    100,
    Math.floor(totalSess * 2 + bestStreak * 4 + totalHours)
  );

  const trend =
    totalSess >= 20
      ? "Mükemmel tempo 🚀"
      : totalSess >= 10
      ? "İyi gidiyorsun 🔥"
      : totalSess >= 5
      ? "İstikrar oluşuyor ⚡"
      : "Başlangıç aşaması 🌱";

  return (
    <div className="stats-container">
      <PageTitle sub={`${totalSess} seans · ${totalMins} dakika`}>
        İstatistikler
      </PageTitle>

      {/* RANGE */}
      <div className="stats-range">
        {[
          ["week", "7 Gün"],
          ["month", "30 Gün"],
          ["all", "Tümü"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setRange(k)}
            className="stats-range-btn"
            style={{
              background: range === k ? scene.accent + "30" : "transparent",
              color: range === k ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* HERO */}
      <div className="stats-grid">
        {[
          { icon: "🎯", label: "Seans", value: totalSess, sub: "tamamlanan" },
          { icon: "⏳", label: "Saat", value: totalHours, sub: "odak" },
          { icon: "🔥", label: "Seri", value: bestStreak, sub: "gün" },
          { icon: "⚡", label: "XP", value: totalXP, sub: `Level ${level}` },
        ].map((x) => (
          <div key={x.label} className="stats-card">
            <div className="shine" />
            <div className="stats-icon">{x.icon}</div>
            <div className="stats-value" style={{ color: scene.accent }}>
              {x.value}
            </div>
            <div className="stats-sub">{x.sub}</div>
            <div className="stats-label">{x.label}</div>
          </div>
        ))}
      </div>

      {/* SCORE */}
      <Card>
        <SectionLabel>Productivity Score</SectionLabel>

        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <div className="score-circle" style={{ color: scene.accent }}>
            <div
              className="score-fill"
              style={{
                transform: `rotate(${productivityScore * 3.6}deg)`,
                borderTopColor: scene.accent,
              }}
            />
            <div className="score-value">{productivityScore}</div>
          </div>

          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{trend}</div>
            <div style={{ opacity: 0.6, marginTop: 8 }}>
              Performans analiz edildi
            </div>
          </div>
        </div>
      </Card>

      {/* CHART */}
      <Card>
        <SectionLabel>Son 7 Gün</SectionLabel>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 170 }}>
          {days7.map((d) => (
            <div key={d.label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: scene.accent, fontWeight: 700 }}>
                {d.count}
              </div>

              <div
                className="bar"
                style={{
                  height: `${Math.max(10, (d.count / maxBar) * 120)}px`,
                  background: `linear-gradient(to top, ${scene.accent}, ${scene.accent}55)`,
                }}
              />

              <div style={{ fontSize: 10, opacity: 0.4 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* LEVEL */}
      <Card>
        <SectionLabel>Level</SectionLabel>

        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Level {level}</span>
            <span style={{ color: scene.accent }}>
              {Math.floor(levelProgress)}%
            </span>
          </div>

          <div className="level-bar">
            <div
              className="level-fill"
              style={{
                width: `${levelProgress}%`,
                background: `linear-gradient(to right, ${scene.accent}, #fff)`,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}