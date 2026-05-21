import React, { useMemo, useEffect, useRef, useState } from "react";
import { useLottie } from "lottie-react";
import { BADGE_DEFS } from "../constants";
import { PageTitle, Card } from "../components/CommonUI/CommonUI";
import { useGlobal } from "../context/GlobalContext";

/* =========================
   ANIMATIONS
========================= */

import stepAnim from "../assets/animations/step.json";
import fireAnim from "../assets/animations/fire.json";
import boltAnim from "../assets/animations/bolt.json";
import targetAnim from "../assets/animations/target.json";
import rocketAnim from "../assets/animations/rocket.json";
import trophyAnim from "../assets/animations/trophy.json";
import crownAnim from "../assets/animations/crown.json";
import starAnim from "../assets/animations/star.json";
import sunAnim from "../assets/animations/sun.json";
import runAnim from "../assets/animations/run.json";
import galaxyAnim from "../assets/animations/galaxy.json";
import diamondAnim from "../assets/animations/diamond.json";

const animationMap = {
  "step.json": stepAnim.default || stepAnim,
  "fire.json": fireAnim.default || fireAnim,
  "bolt.json": boltAnim.default || boltAnim,
  "target.json": targetAnim.default || targetAnim,
  "rocket.json": rocketAnim.default || rocketAnim,
  "trophy.json": trophyAnim.default || trophyAnim,
  "crown.json": crownAnim.default || crownAnim,
  "star.json": starAnim.default || starAnim,
  "sun.json": sunAnim.default || sunAnim,
  "run.json": runAnim.default || runAnim,
  "galaxy.json": galaxyAnim.default || galaxyAnim,
  "diamond.json": diamondAnim.default || diamondAnim,
};

/* =========================
   RARITY SYSTEM
========================= */

const rarityStyles = {
  common: {
    glow: "0 0 0 rgba(255,255,255,0)",
    border: "rgba(255,255,255,0.08)",
    shine: "rgba(255,255,255,0.08)",
    label: "#a1a1aa",
  },

  rare: {
    glow: "0 0 24px rgba(59,130,246,0.45)",
    border: "rgba(59,130,246,0.5)",
    shine: "rgba(96,165,250,0.35)",
    label: "#60a5fa",
  },

  epic: {
    glow: "0 0 28px rgba(168,85,247,0.5)",
    border: "rgba(168,85,247,0.55)",
    shine: "rgba(192,132,252,0.4)",
    label: "#c084fc",
  },

  legendary: {
    glow: "0 0 36px rgba(251,191,36,0.75)",
    border: "rgba(251,191,36,0.8)",
    shine: "rgba(253,224,71,0.45)",
    label: "#fde047",
  },
};

/* =========================
   BADGE CONFIG
========================= */

const badgeMeta = {
  first: {
    rarity: "common",
    xp: 50,
  },

  focus5: {
    rarity: "rare",
    xp: 120,
  },

  focus25: {
    rarity: "epic",
    xp: 300,
  },

  focus100: {
    rarity: "legendary",
    xp: 1000,
  },
};

/* =========================
   LOTTIE
========================= */
const LottieIcon = ({ animData, isHovered }) => {
  const options = {
    animationData: animData,
    loop: true,
    autoplay: false,
  };

  const style = {
    width: 68,
    height: 68,
    pointerEvents: "none",
  };

  const { View, animationItem } = useLottie(options, style);

  useEffect(() => {
    if (!animationItem) return;

    if (isHovered) {
      animationItem.play();
    } else {
      animationItem.pause();
      animationItem.goToAndStop(0, true);
    }
  }, [isHovered, animationItem]);

  return View;
};  

/* =========================
   PAGE
========================= */

export default function BadgesPage({ scene }) {
  const { sessions } = useGlobal();

  const safeSessions = sessions || [];

  const prevEarnedRef = useRef([]);

  const [popup, setPopup] = useState(null);
  const [hoveredBadge, setHoveredBadge] = useState(null);


  /* =========================
     STATS
  ========================= */

  const totalMins = useMemo(
    () => safeSessions.reduce((a, s) => a + (s.duration || 25), 0),
    [safeSessions]
  );

  const sessionCount = safeSessions.length;

  /* =========================
     XP SYSTEM
  ========================= */

  const totalXP = totalMins * 2 + sessionCount * 15;

  const currentLevel = Math.floor(totalXP / 500) + 1;

  const currentLevelXP = totalXP % 500;

  const levelProgress = (currentLevelXP / 500) * 100;

  /* =========================
     BADGES
  ========================= */

  const earned = useMemo(() => {
    return BADGE_DEFS.filter((b) =>
      b.req(sessionCount, totalMins)
    );
  }, [sessionCount, totalMins]);

  /* =========================
     UNLOCK POPUP
  ========================= */

  useEffect(() => {
    const prevIds = prevEarnedRef.current.map((b) => b.id);

    const newBadge = earned.find(
      (b) => !prevIds.includes(b.id)
    );

    if (newBadge) {
      setPopup(newBadge);

      setTimeout(() => {
        setPopup(null);
      }, 4200);
    }

    prevEarnedRef.current = earned;
  }, [earned]);

  return (
    <>
      {/* =========================
          UNLOCK POPUP
      ========================= */}

      {popup && (
        <div className="achievement-popup">
          <div className="achievement-icon">🏆</div>

          <div>
            <div className="achievement-title">
              ACHIEVEMENT UNLOCKED
            </div>

            <div className="achievement-name">
              {popup.name}
            </div>

            <div className="achievement-xp">
              +{badgeMeta[popup.id]?.xp || 100} XP
            </div>
          </div>
        </div>
      )}

      {/* =========================
          LAYOUT
      ========================= */}

      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* =========================
            LEFT PANEL
        ========================= */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <PageTitle>Kariyer</PageTitle>

          <Card
            style={{
              padding: 24,
              textAlign: "center",
              background: "rgba(255,255,255,0.03)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* SHINE */}

            <div className="xp-shine" />

            <div
              style={{
                fontSize: 54,
                marginBottom: 8,
              }}
            >
              ⚡
            </div>

            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              LEVEL
            </div>

            <div
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: scene.accent,
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              {currentLevel}
            </div>

            <div
              style={{
                marginTop: 18,
                height: 8,
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${levelProgress}%`,
                  height: "100%",
                  background: scene.accent,
                  borderRadius: 999,
                  transition: "width 0.8s ease",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {Math.floor(currentLevelXP)} / 500 XP
            </div>

            <div
              style={{
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div className="mini-stat">
                <div className="mini-stat-label">SESSIONS</div>
                <div className="mini-stat-value">
                  {sessionCount}
                </div>
              </div>

              <div className="mini-stat">
                <div className="mini-stat-label">TOTAL XP</div>
                <div className="mini-stat-value">
                  {totalXP}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* =========================
            BADGES
        ========================= */}

        <div>
          <PageTitle
            sub={`${earned.length}/${BADGE_DEFS.length} achievement unlocked`}
          >
            Achievements
          </PageTitle>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {BADGE_DEFS.map((b) => {
              const has = b.req(sessionCount, totalMins);

              const animData = animationMap[b.anim];

              const meta = badgeMeta[b.id] || {
                rarity: "common",
                xp: 100,
              };

              const rarity = rarityStyles[meta.rarity];

              /* =========================
                 PROGRESS
              ========================= */

              let progress = 0;

              if (b.id === "first") {
                progress = Math.min(
                  (sessionCount / 1) * 100,
                  100
                );
              }

              else if (b.id === "focus5") {
                progress = Math.min(
                  (sessionCount / 5) * 100,
                  100
                );
              }

              else if (b.id === "focus25") {
                progress = Math.min(
                  (sessionCount / 25) * 100,
                  100
                );
              }

              else if (b.id === "focus100") {
                progress = Math.min(
                  (sessionCount / 100) * 100,
                  100
                );
              }

              return (
               <Card
  key={b.id}
  onMouseEnter={() => setHoveredBadge(b.id)}
  onMouseLeave={() => setHoveredBadge(null)}
                  className={`badge-card ${
                    has ? "unlocked" : "locked"
                  }`}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    background: has
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.025)",
                    border: `1px solid ${
                      has
                        ? rarity.border
                        : "rgba(255,255,255,0.06)"
                    }`,
                    boxShadow: has
                      ? rarity.glow
                      : "none",
                    transition: "all 0.35s ease",
                    transform: has
                      ? "scale(1)"
                      : "scale(0.98)",
                  }}
                >
                  {/* SHINE */}

                  {has && (
                    <div
                      className="badge-shine"
                      style={{
                        background: `linear-gradient(
                          115deg,
                          transparent 20%,
                          ${rarity.shine} 50%,
                          transparent 80%
                        )`,
                      }}
                    />
                  )}

                  {/* TOOLTIP */}

                  <div className="badge-tooltip">
                    {has
                      ? b.desc
                      : `Görev: ${b.task}`}
                  </div>

                  {/* RARITY */}

                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: rarity.label,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {meta.rarity}
                  </div>

                  {/* ICON */}

                  <div
                    style={{
                      position: "relative",
                      width: 74,
                      height: 74,
                      borderRadius: 18,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: has
                        ? "none"
                        : "grayscale(1) brightness(0.35)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {animData && (
<LottieIcon
  key={`${b.id}-${hoveredBadge === b.id}`}
  animData={animData}
  isHovered={hoveredBadge === b.id}
/>               )}

                    {!has && (
                      <div className="badge-lock">
                        🔒
                      </div>
                    )}
                  </div>

                  {/* TITLE */}

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      textAlign: "center",
                      color: has
                        ? "white"
                        : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {b.name}
                  </div>

                  {/* XP */}

                  <div
                    style={{
                      fontSize: 11,
                      color: scene.accent,
                      fontWeight: 700,
                    }}
                  >
                    +{meta.xp} XP
                  </div>

                  {/* PROGRESS */}

                  <div
                    style={{
                      width: "100%",
                      marginTop: 2,
                    }}
                  >
                    <div
                      style={{
                        height: 5,
                        borderRadius: 999,
                        background:
                          "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: has
                            ? rarity.label
                            : "rgba(255,255,255,0.25)",
                          transition:
                            "width 0.6s ease",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 10,
                        color:
                          "rgba(255,255,255,0.35)",
                        textAlign: "center",
                      }}
                    >
                      {Math.floor(progress)}%
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}