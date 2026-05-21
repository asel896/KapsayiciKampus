import React, { useState, useMemo } from "react";
import { FRIENDS_DATA } from "../constants";
import { PageTitle, Card, SectionLabel } from "../components/CommonUI/CommonUI";
import "./FriendsPage.css";

export default function FriendsPage({ scene }) {
  const [invite, setInvite] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const sLabel = {
    online: "Çevrimiçi",
    focus: "Odaklanıyor 🔥",
    offline: "Çevrimdışı",
  };

  const sColor = {
    online: "#4ade80",
    focus: "#fb923c",
    offline: "rgba(255,255,255,0.25)",
  };

  const filteredFriends = useMemo(() => {
    return FRIENDS_DATA.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : f.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const leaderboard = [...FRIENDS_DATA]
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);

  const onlineCount = FRIENDS_DATA.filter((f) => f.status !== "offline").length;
  const focusCount = FRIENDS_DATA.filter((f) => f.status === "focus").length;
  const totalSessions = FRIENDS_DATA.reduce((a, b) => a + b.sessions, 0);

  return (
    <div className="friends-container">
      <PageTitle sub={`${focusCount} kişi şu an odaklanıyor`}>
        Arkadaşlar
      </PageTitle>

      {/* STATS */}
      <div className="friends-stats">
        {[
          { label: "Çevrimiçi", value: onlineCount, color: "#4ade80" },
          { label: "Odak Modu", value: focusCount, color: "#fb923c" },
          { label: "Toplam", value: totalSessions, color: scene.accent },
        ].map((x) => (
          <div key={x.label} className="friends-stat-card">
            <div className="friends-stat-value" style={{ color: x.color }}>
              {x.value}
            </div>
            <div className="friends-stat-label">{x.label}</div>
          </div>
        ))}
      </div>

      {/* INVITE */}
      <Card style={{ marginBottom: 16 }}>
        <SectionLabel>Arkadaş Davet Et</SectionLabel>

        <div className="friends-invite-row">
          <input
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            placeholder="E-posta ile davet et..."
            className="friends-input"
          />

          <button
            onClick={() => {
              if (!invite.trim()) return;
              alert("Davet gönderildi 🚀");
              setInvite("");
            }}
            className="friends-invite-btn"
            style={{
              background: scene.accent + "20",
              borderColor: scene.accent + "35",
              color: scene.accent,
            }}
          >
            Gönder
          </button>
        </div>
      </Card>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Arkadaş ara..."
        className="friends-input"
        style={{ marginBottom: 14 }}
      />

      {/* FILTERS */}
      <div className="friends-filters">
        {[
          ["all", "Tümü"],
          ["online", "Online"],
          ["focus", "Odakta"],
          ["offline", "Offline"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className="friends-filter-btn"
            style={{
              background:
                filter === k
                  ? "rgba(255,255,255,0.13)"
                  : "rgba(255,255,255,0.04)",
              color: filter === k ? "white" : "rgba(255,255,255,0.45)",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* FRIEND LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredFriends.length === 0 && (
          <div style={{ textAlign: "center", opacity: 0.3, padding: 30 }}>
            Sonuç bulunamadı
          </div>
        )}

        {filteredFriends.map((f, i) => (
          <div
            key={i}
            className="friend-card"
            style={{
              background:
                f.status === "focus"
                  ? `${scene.accent}10`
                  : "rgba(255,255,255,0.05)",
              border:
                f.status === "focus"
                  ? `1px solid ${scene.accent}25`
                  : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* AVATAR */}
            <div style={{ position: "relative" }}>
              <div
                className="friend-avatar"
                style={{
                  background: `${scene.accent}20`,
                  border: `1.5px solid ${scene.accent}35`,
                  color: scene.accent,
                }}
              >
                {f.avatar}
              </div>

              <div
                className="friend-status-dot"
                style={{ background: sColor[f.status] }}
              />
            </div>

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <div className="friend-name">{f.name}</div>

              <div className="friend-status" style={{ color: sColor[f.status] }}>
                {sLabel[f.status]}
              </div>

              <div className="friend-progress">
                <div
                  className="friend-progress-fill"
                  style={{
                    width: `${Math.min(100, (f.sessions / 100) * 100)}%`,
                    background: scene.accent,
                  }}
                />
              </div>
            </div>

            {/* STATS */}
            <div style={{ textAlign: "right" }}>
              <div className="friend-session">{f.sessions}</div>
              <div className="friend-session-label">seans</div>

              <div className="friend-streak" style={{ color: "#fb923c" }}>
                🔥 {f.streak}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LEADERBOARD */}
      <Card style={{ marginTop: 16 }}>
        <SectionLabel>Haftalık Liderlik</SectionLabel>

        {leaderboard.map((f, i) => (
          <div key={i} className="leader-row">
            <div style={{ width: 28, textAlign: "center" }}>
              {["🥇", "🥈", "🥉", "🏅", "🏅"][i]}
            </div>

            <div className="leader-name">{f.name}</div>

            <div className="leader-score" style={{ color: scene.accent }}>
              {f.sessions} seans
            </div>
          </div>
        ))}
      </Card>

      {/* FOCUS PARTY */}
      <Card style={{ marginTop: 16 }}>
        <SectionLabel>Odak Partisi</SectionLabel>

        <div className="focus-scroll">
          {FRIENDS_DATA.filter((f) => f.status === "focus").map((f, i) => (
            <div key={i} className="focus-card">
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  margin: "0 auto 10px",
                  background: `${scene.accent}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: scene.accent,
                  fontWeight: 700,
                }}
              >
                {f.avatar}
              </div>

              <div style={{ fontSize: 13, color: "white" }}>{f.name}</div>

              <div style={{ fontSize: 11, color: "#fb923c" }}>
                Şu an odakta 🔥
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}