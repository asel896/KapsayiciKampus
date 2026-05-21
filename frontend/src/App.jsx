import React, { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { GlobalProvider, useGlobal } from "./context/GlobalContext";
import Navbar from "./components/Navbar";
import { Particle } from "./components/CommonUI/CommonUI";

/* PAGES */
import PomodoroPage from "./pages/PomodoroPage";
import TasksPage from "./pages/TasksPage";
import StatsPage from "./pages/StatsPage";
import AIPage from "./pages/AIPage";
import FriendsPage from "./pages/FriendsPage";
import SettingsPage from "./pages/SettingsPage";
import BadgesPage from "./pages/BadgesPage";

/* =====================================================
   ROOT
===================================================== */

export default function App() {
  return (
    <GlobalProvider>
      <GlobalStyles />
      <AppContent />
    </GlobalProvider>
  );
}

/* =====================================================
   MAIN APP
===================================================== */

function AppContent() {
  const [activePage, setActivePage] = useState("pomodoro");
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Player yüklenme kontrolü
  const { currentScene, sceneIndex, setSceneIndex, settings, isPlayingAudio, audioUrl } = useGlobal();

  const backgroundStyle = useMemo(() => {
    if (settings?.customBackground) {
      return {
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,${settings.overlay / 100}),
            rgba(0,0,0,${settings.overlay / 100})
          ),
          url(${settings.customBackground})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      };
    }
    return {
      background: currentScene?.gradient,
    };
  }, [settings, currentScene]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        ...backgroundStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "90px 20px 110px",
        transition: "all 0.8s ease",
        filter: `brightness(${settings?.brightness}%)`,
      }}
    >
      {/* YOUTUBE PLAYER - GÜNCELLENDİ */}
      <ReactPlayer 
        url={audioUrl} 
        playing={isPlayerReady && isPlayingAudio} // Sadece hazır olduğunda oynat
        volume={settings?.ambientVolume / 100 || 0.5} 
        loop={true} 
        width="0" 
        height="0" 
        muted={false} 
        onReady={() => setIsPlayerReady(true)} // Player yüklendiğinde durumu güncelle
        config={{
          youtube: {
            playerVars: { 
              autoplay: 1, 
              controls: 0, 
              showinfo: 0, 
              modestbranding: 1 
            }
          }
        }}
      />

      {/* GLASS OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: `blur(${settings?.blur}px)`,
          background: `rgba(255,255,255,${settings?.glass / 500})`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* PARTICLES */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <Particle
            key={i}
            accent={currentScene?.accent}
            sym={currentScene?.sym}
            i={i}
          />
        ))}
      </div>

      {/* LOGO */}
      <div
        style={{
          position: "fixed",
          top: 22,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'DM Serif Display', serif",
          fontSize: 15,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.1em",
          fontStyle: "italic",
          zIndex: 50,
        }}
      >
        focus
      </div>

      {/* SCENE SWITCH BUTTON */}
      <button
        onClick={() => setSceneIndex((prev) => (prev + 1) % 6)}
        style={{
          position: "fixed",
          top: 18,
          right: 22,
          zIndex: 50,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 999,
          color: "rgba(255,255,255,0.55)",
          padding: "7px 16px",
          fontSize: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: currentScene?.accent }}>{currentScene?.sym}</span>
        {currentScene?.name}
      </button>

      {/* PAGE CONTENT */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          animation: "pageIn .4s ease",
        }}
      >
        <ActivePageRenderer page={activePage} />
      </div>

      {/* NAVBAR */}
      <div style={{ position: "relative", zIndex: 20 }}>
        <Navbar active={activePage} setActive={setActivePage} scene={currentScene} />
      </div>
    </div>
  );
}

/* =====================================================
   PAGE ROUTER
===================================================== */

function ActivePageRenderer({ page }) {
  const { currentScene, sceneIndex, setSceneIndex } = useGlobal();
  const pages = {
    pomodoro: <PomodoroPage scene={currentScene} />,
    tasks: <TasksPage scene={currentScene} />,
    stats: <StatsPage scene={currentScene} />,
    ai: <AIPage scene={currentScene} />,
    friends: <FriendsPage scene={currentScene} />,
    settings: (
      <SettingsPage
        scene={currentScene}
        sceneIndex={sceneIndex}
        setSceneIndex={setSceneIndex}
      />
    ),
    badges: <BadgesPage scene={currentScene} />,
  };
  return pages[page] || pages.pomodoro;
}

/* =====================================================
   GLOBAL STYLES
===================================================== */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root {
        width: 100%;
        min-height: 100vh;
        overflow-x: hidden;
        background: black;
      }
      ::-webkit-scrollbar { width: 0; }
      @keyframes pageIn {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}