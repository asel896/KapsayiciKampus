import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

import { useTimer } from "../hooks/useTimer";
import { useGlobal } from "./GlobalContext";

const TimerContext = createContext();

export const TimerProvider = ({
  children,
}) => {
  const {
    durations,
    settings,
    sessions,
    setSessions,
    audioEngine,
    sendNotification,
  } = useGlobal();

  /* =========================================================
     MODES
  ========================================================= */

  const MODES = {
    pomodoro: durations.pomodoro * 60,
    short: durations.short * 60,
    long: durations.long * 60,
  };

  const currentModeRef = useRef("pomodoro");
  const pomodoroCountRef = useRef(0);

  /* =========================================================
     TIMER
  ========================================================= */

  const timer = useTimer(MODES.pomodoro);

  const {
    timeLeft,
    isActive,
    setTimeLeft,
    reset,
    toggle,
  } = timer;

  /* =========================================================
     SWITCH MODE
  ========================================================= */

  const switchMode = (mode) => {
    currentModeRef.current = mode;

    reset(MODES[mode]);

    /* NOTIFICATION */

    sendNotification(
      "Pomodoro",
      `${
        {
          pomodoro: "Odak",
          short: "Kısa mola",
          long: "Uzun mola",
        }[mode]
      } başladı`
    );
  };

  /* =========================================================
     SESSION FINISHED
  ========================================================= */

  useEffect(() => {
    if (
      timeLeft !== 0 ||
      !isActive
    )
      return;

    const currentMode =
      currentModeRef.current;

    /* =====================================================
       DONE SOUND
    ===================================================== */

    audioEngine?.playDoneSound?.();

    /* =====================================================
       SAVE SESSION
    ===================================================== */

    if (currentMode === "pomodoro") {
      const newSession = {
        id: Date.now(),

        date: new Date().toLocaleDateString(
          "tr-TR"
        ),

        duration:
          durations.pomodoro,

        mode: "pomodoro",

        hour: new Date().getHours(),

        createdAt:
          new Date().toISOString(),
      };

      const updated = [
        ...sessions,
        newSession,
      ];

      setSessions(updated);

      localStorage.setItem(
        "pomSessions",
        JSON.stringify(updated)
      );

      pomodoroCountRef.current += 1;

      /* NOTIFICATION */

      sendNotification(
        "Odak seansı tamamlandı 🎉",
        `${durations.pomodoro} dakikalık seansı bitirdin`
      );

      /* =====================================================
         AUTO BREAK
      ===================================================== */

      if (settings.autoBreak) {
        const shouldLongBreak =
          pomodoroCountRef.current %
            4 ===
          0;

        const nextMode =
          shouldLongBreak
            ? "long"
            : "short";

        switchMode(nextMode);

        if (
          settings.autoPomodoro
        ) {
          setTimeout(() => {
            toggle();
          }, 400);
        }
      }
    } else {
      /* =====================================================
         BREAK FINISHED
      ===================================================== */

      sendNotification(
        "Mola bitti 🚀",
        "Yeni odak seansına hazır mısın?"
      );

      if (
        settings.autoPomodoro
      ) {
        switchMode("pomodoro");

        setTimeout(() => {
          toggle();
        }, 400);
      }
    }
  }, [timeLeft]);

  /* =========================================================
     SYNC DURATIONS
  ========================================================= */

  useEffect(() => {
    const mode =
      currentModeRef.current;

    if (!isActive) {
      setTimeLeft(MODES[mode]);
    }
  }, [durations]);

  /* =========================================================
     ZEN MODE
  ========================================================= */

  useEffect(() => {
    if (!settings.zenMode)
      return;

    document.body.style.overflow =
      isActive ? "hidden" : "auto";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [
    isActive,
    settings.zenMode,
  ]);

  /* =========================================================
     PAGE TITLE
  ========================================================= */

  useEffect(() => {
    const mins = Math.floor(
      timeLeft / 60
    )
      .toString()
      .padStart(2, "0");

    const secs = (timeLeft % 60)
      .toString()
      .padStart(2, "0");

    const mode =
      currentModeRef.current;

    const modeLabel =
      {
        pomodoro: "Odak",
        short: "Kısa Mola",
        long: "Uzun Mola",
      }[mode] || "Pomodoro";

    document.title = `${mins}:${secs} • ${modeLabel}`;

    return () => {
      document.title =
        "Pomodoro";
    };
  }, [timeLeft]);

  /* =========================================================
     PROVIDER
  ========================================================= */

  return (
    <TimerContext.Provider
      value={{
        ...timer,

        currentMode:
          currentModeRef.current,

        switchMode,

        modes: MODES,

        completedPomodoros:
          pomodoroCountRef.current,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext =
  () => useContext(TimerContext);