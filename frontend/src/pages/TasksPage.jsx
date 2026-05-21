import React, { useState, useEffect, useMemo } from "react";
import { PageTitle } from "../components/CommonUI/CommonUI";
import { useGlobal } from "../context/GlobalContext";
import "./TasksPage.css";

export default function TasksPage({ scene }) {
  const { addXP } = useGlobal?.() || {};

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("pomTasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pomTasks", JSON.stringify(tasks));
  }, [tasks]);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [category, setCategory] = useState("study");
  const [priority, setPriority] = useState("normal");
  const [deadline, setDeadline] = useState("");
  const [pomodoros, setPomodoros] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const prioColor = {
    high: "#f87171",
    normal: "#facc15",
    low: "#6ee7b7",
  };

  const catColor = {
    study: "#60a5fa",
    work: "#f97316",
    health: "#10b981",
    personal: "#a78bfa",
  };

  const add = () => {
    if (!input.trim()) return;

    setTasks([
      {
        id: Date.now(),
        text: input.trim(),
        done: false,
        priority,
        category,
        deadline,
        pomodoros,
        completedPomodoros: 0,
      },
      ...tasks,
    ]);

    setInput("");
  };

  const toggle = (id) => {
    setTasks(
      tasks.map((t) => {
        if (t.id !== id) return t;

        const newDone = !t.done;

        if (newDone && addXP) addXP(25);

        return { ...t, done: newDone };
      })
    );
  };

  const remove = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filtered = useMemo(() => {
    return tasks
      .sort((a, b) => {
        const order = { high: 0, normal: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      })
      .filter((t) => {
        const okFilter =
          filter === "all"
            ? true
            : filter === "done"
            ? t.done
            : !t.done;

        const okSearch = t.text
          .toLowerCase()
          .includes(search.toLowerCase());

        return okFilter && okSearch;
      });
  }, [tasks, filter, search]);

  const completed = tasks.filter((t) => t.done).length;
  const active = tasks.filter((t) => !t.done).length;

  const progress = tasks.length
    ? (completed / tasks.length) * 100
    : 0;

  return (
    <div className="tasks-container">
      <PageTitle sub={`${completed}/${tasks.length} tamamlandı`}>
        Görevler
      </PageTitle>

      {/* STATS */}
      <div className="tasks-stats">
        {[tasks.length, active, completed, 0].map((v, i) => (
          <div key={i} className="tasks-stat">
            <div className="tasks-stat-value" style={{ color: scene.accent }}>
              {v}
            </div>
            <div className="tasks-stat-label">
              {["Toplam", "Aktif", "Biten", "High"][i]}
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="tasks-progress-wrap">
        <div className="tasks-progress-header">
          <span>Günlük İlerleme</span>
          <span style={{ color: scene.accent, fontWeight: 700 }}>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="tasks-progress-bar">
          <div
            className="tasks-progress-fill"
            style={{ width: `${progress}%`, background: scene.accent }}
          />
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="tasks-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Görev ara..."
      />

      {/* ADD */}
      <div style={{ marginTop: 18, marginBottom: 22 }}>
        <input
          className="tasks-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yeni görev..."
          onKeyDown={(e) => e.key === "Enter" && add()}
        />

        <button
          onClick={add}
          className="tasks-btn tasks-add-btn"
          style={{ marginTop: 10 }}
        >
          Görev Ekle
        </button>
      </div>

      {/* FILTERS */}
      <div className="tasks-filters">
        {["all", "active", "done"].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className="tasks-filter-btn"
            style={{
              background:
                filter === k ? scene.accent : "rgba(255,255,255,0.06)",
              color: filter === k ? "#111" : "rgba(255,255,255,0.5)",
            }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* TASKS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((task) => (
          <div
            key={task.id}
            className="task-card"
            style={{
              background: task.done
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.06)",
            }}
          >
            <div className="task-header">
              <div
                className="priority-dot"
                style={{ background: prioColor[task.priority] }}
              />

              <button
                className="task-check"
                onClick={() => toggle(task.id)}
                style={{
                  borderColor: task.done
                    ? scene.accent
                    : "rgba(255,255,255,.25)",
                  background: task.done ? scene.accent : "transparent",
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  className={`task-title ${
                    task.done ? "task-title-done" : ""
                  }`}
                >
                  {task.text}
                </div>

                <div className="task-meta">
                  <div
                    className="tag"
                    style={{
                      background: catColor[task.category] + "20",
                      color: catColor[task.category],
                    }}
                  >
                    {task.category}
                  </div>

                  {task.deadline && (
                    <div className="tag tag-muted">📅 {task.deadline}</div>
                  )}

                  <div className="tag tag-muted">
                    🍅 {task.completedPomodoros}/{task.pomodoros}
                  </div>
                </div>
              </div>

              <div className="task-actions">
                <button className="icon-btn">🍅</button>
                <button className="icon-btn">✏️</button>
                <button className="icon-btn">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}