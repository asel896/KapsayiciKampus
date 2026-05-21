import React, { useEffect, useMemo, useState } from "react";
import "./PomodoroPage.css";

import { Ring, fmt } from "../components/CommonUI/CommonUI";
import { useGlobal } from "../context/GlobalContext";
import { useTimer } from "../hooks/useTimer";

export default function PomodoroPage({ scene }) {
  const { 
    durations, sessions, setSessions, audioEngine, 
    isPlayingAudio, toggleAudio 
  } = useGlobal();

  const MODES = {
    pomodoro: { label: "Odak", color: "#e8735a", emoji: "🍅" },
    short: { label: "Kısa Mola", color: "#5a9e8f", emoji: "☕" },
    long: { label: "Uzun Mola", color: "#5a7dbf", emoji: "🌙" },
  };

  const [modeKey, setModeKey] = useState("pomodoro");
  const mode = MODES[modeKey];

  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pomTasks")) || []; }
    catch { return []; }
  });

  const [selectedTask, setSelectedTask] = useState(null);

  const total = durations[modeKey] * 60;
  const { timeLeft, isActive, toggle, reset } = useTimer(total);

  const todayStr = new Date().toLocaleDateString("tr-TR");
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todayFocus = todaySessions.reduce((a, s) => a + (s.duration || 25), 0);
  const todayCount = todaySessions.length;

  const totalXP = todayFocus * 2 + todayCount * 15;
  const level = Math.floor(totalXP / 500) + 1;
  const progress = ((totalXP % 500) / 500) * 100;

  const activeTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      const session = {
        date: todayStr,
        duration: durations[modeKey],
        mode: modeKey,
        hour: new Date().getHours(),
      };

      const next = [...sessions, session];
      setSessions(next);
      localStorage.setItem("pomSessions", JSON.stringify(next));

      audioEngine?.playDoneSound?.();

      if (modeKey === "pomodoro") {
        setTimeout(() => switchMode("short"), 1200);
      }
    }
  }, [timeLeft]);

  const switchMode = (k) => {
    setModeKey(k);
    reset(durations[k] * 60);
  };

  const ringProgress = 1 - timeLeft / total;

  return (
    <div className="pomodoro-page">
      <div className="header">
        <h1>Focus Session</h1>
        <p>Bugün {todayCount} seans · {todayFocus} dakika</p>
      </div>

      <div className="level-card">
        <div className="level-info">
          <div>
            <div className="label">LEVEL</div>
            <div className="level-number">{level}</div>
          </div>
          <div className="xp-box">
            <div>Total XP</div>
            <div>{totalXP}</div>
          </div>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mode-switch">
        {Object.entries(MODES).map(([k, m]) => (
          <button
            key={k}
            className={modeKey === k ? "active" : ""}
            onClick={() => switchMode(k)}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <select
        className="task-select"
        value={selectedTask || ""}
        onChange={(e) => setSelectedTask(Number(e.target.value))}
      >
        <option value="">Görev seç...</option>
        {activeTasks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.text}
          </option>
        ))}
      </select>

      <div className="timer-wrapper">
        <div
          className="glow"
          style={{
            background: mode.color,
            opacity: isActive ? 0.2 : 0.08,
          }}
        />
        <Ring
          progress={ringProgress}
          color={isActive ? mode.color : "rgba(255,255,255,0.25)"}
        >
          <div className="timer">
            <div className="time">{fmt(timeLeft)}</div>
            <div className="mode">{mode.label}</div>
          </div>
        </Ring>
      </div>

      <div className="controls">
        <button
          className="start"
          style={{ background: mode.color }}
          onClick={toggle}
        >
          {isActive ? "Duraklat" : "Başlat"}
        </button>
        <button className="reset" onClick={() => reset(durations[modeKey] * 60)}>
          Reset
        </button>
      </div>

      <div className="music-controls">
        <button 
          className={`music-btn ${isPlayingAudio ? "active" : ""}`}
          onClick={toggleAudio}
        >
          {isPlayingAudio ? "🔇 Sıfır Sesini Kapat" : "🎧 Sıfır Modunu Aç"}
        </button>
      </div>

      <div className="mini-stats">
        <div>
          <span>{todayCount}</span>
          Bugünkü Seans
        </div>
        <div>
          <span>{todayFocus}</span>
          Odak Dakikası
        </div>
        <div>
          <span>{activeTasks.length}</span>
          Aktif Görev
        </div>
      </div>
    </div>
  );
}