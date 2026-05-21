import { createContext, useContext, useEffect, useState } from "react";
import { useSoundEngine } from "../hooks/useSoundEngine";
import { DEFAULT_DURATIONS, SCENES } from "../constants";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  /* =========================================================
     SESSIONS & DURATIONS
  ========================================================= */
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pomSessions")) || []; }
    catch { return []; }
  });

  const [durations, setDurations] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pomDurations")) || DEFAULT_DURATIONS; }
    catch { return DEFAULT_DURATIONS; }
  });

  useEffect(() => {
    localStorage.setItem("pomSessions", JSON.stringify(sessions));
  }, [sessions]);

  const saveDurations = (d) => {
    setDurations(d);
    localStorage.setItem("pomDurations", JSON.stringify(d));
  };

  /* =========================================================
     SETTINGS
  ========================================================= */
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pomSettings")) || {
        glass: 18, blur: 24, brightness: 70, overlay: 35,
        masterVolume: 80, ambientVolume: 40, soundEffects: true,
        customBackground: null,
      };
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("pomSettings", JSON.stringify(settings));
  }, [settings]);

  /* =========================================================
     SIFIR (YOUTUBE AMBIENT) SYSTEM
  ========================================================= */
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  // Varsayılan odak sesi (Brown Noise)
  const [audioUrl, setAudioUrl] = useState("https://www.youtube.com/watch?v=4vIQON2fDWM");

  const toggleAudio = () => setIsPlayingAudio(!isPlayingAudio);

  /* =========================================================
     SCENE & AUDIO ENGINE (Effects)
  ========================================================= */
  const [sceneIndex, setSceneIndex] = useState(() => {
    try { return Number(localStorage.getItem("pomSceneIndex") || 0); }
    catch { return 0; }
  });

  const currentScene = SCENES?.[sceneIndex] || SCENES?.[0];

  // Efektler için motor
  const audioEngine = useSoundEngine({
    masterVolume: settings.masterVolume,
    enabled: settings.soundEffects,
  });

  /* =========================================================
     GLOBAL EFFECTS (CSS Variables)
  ========================================================= */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", currentScene?.accent || "#8b5cf6");
  }, [currentScene]);

  /* =========================================================
     UTILITIES
  ========================================================= */
  const exportData = () => {
    const data = { sessions, durations, settings, sceneIndex };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pomodoro-backup.json";
    a.click();
  };

  return (
    <GlobalContext.Provider
      value={{
        sessions, setSessions,
        durations, saveDurations,
        settings, setSettings,
        sceneIndex, setSceneIndex, currentScene,
        audioEngine,
        isPlayingAudio, toggleAudio, audioUrl, setAudioUrl,
        exportData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);