import React, { useState, useRef } from "react";
import { SCENES } from "../constants";
import "./SettingsPage.css";
import {
  PageTitle,
  Card,
  SectionLabel,
} from "../components/CommonUI/CommonUI";

import {
  Upload,
  Trash2,
  Download,
  UploadCloud,
} from "lucide-react";

import { useGlobal } from "../context/GlobalContext";

export default function SettingsPage({
  sceneIndex,
  setSceneIndex,
  scene,
}) {
  const {
    durations,
    saveDurations,
    settings,
    updateSettings,
    exportData,
    importData,
    resetAllData,
  } = useGlobal();

  /* =========================
     TIMER
  ========================= */

  const [d, setD] = useState({
    ...durations,
  });

  /* =========================
     SETTINGS
  ========================= */

  const {
    glass,
    blur,
    brightness,
    overlay,
    customBackground,

    masterVolume,
    ambientVolume,
    soundEffects,

    autoBreak,
    autoPomodoro,
    fullscreen,
    zenMode,

    badgePopup,
    xpAnimation,
    confetti,
    glowEffects,

    aiSummary,
    aiMotivation,
    aiScore,
  } = settings;

  /* =========================
     FILES
  ========================= */

  const fileRef = useRef();
  const importRef = useRef();

  const uploadBackground = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      updateSettings({
        customBackground:
          reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const success =
      await importData(file);

    if (success) {
      alert("Veriler içe aktarıldı");
    } else {
      alert("Geçersiz dosya");
    }
  };

  /* =========================
     SAVE
  ========================= */

  const save = () => {
    saveDurations(d);

    alert("Ayarlar kaydedildi!");
  };

  /* =========================
     TOGGLE
  ========================= */

  const Toggle = ({
    label,
    value,
    onChange,
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color:
            "rgba(255,255,255,.72)",
        }}
      >
        {label}
      </span>

      <button
        onClick={() =>
          onChange(!value)
        }
        style={{
          width: 52,
          height: 28,

          borderRadius: 999,
          border: "none",

          cursor: "pointer",

          position: "relative",

          transition:
            "all .25s ease",

          background: value
            ? scene.accent
            : "rgba(255,255,255,.12)",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,

            borderRadius: "50%",

            background: "white",

            position: "absolute",

            top: 3,

            left: value
              ? 27
              : 3,

            transition:
              "all .25s ease",
          }}
        />
      </button>
    </div>
  );

  /* =========================
     SLIDER
  ========================= */

  const Slider = ({
    label,
    value,
    min,
    max,
    onChange,
    suffix = "",
  }) => (
    <div
      style={{
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color:
              "rgba(255,255,255,.72)",
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: scene.accent,
          }}
        >
          {value}
          {suffix}
        </span>
      </div>

      <div
        style={{
          position: "relative",

          height: 8,

          borderRadius: 999,

          background:
            "rgba(255,255,255,.08)",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,

            width: `${
              ((value - min) /
                (max - min)) *
              100
            }%`,

            background:
              scene.accent,

            borderRadius: 999,

            boxShadow: `
              0 0 18px ${scene.accent}
            `,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) =>
            onChange(
              Number(
                e.target.value
              )
            )
          }
          style={{
            position: "absolute",
            inset: 0,

            opacity: 0,

            width: "100%",

            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <PageTitle>
        Settings
      </PageTitle>

      <div
        style={{
          width: "100%",

          display: "flex",
          flexDirection: "column",

          gap: 22,
        }}
      >
        {/* TIMER */}

        <Card>
          <SectionLabel>
            ⏱ Timer Settings
          </SectionLabel>

          {[
            {
              key: "pomodoro",
              label:
                "Focus Duration",
              min: 1,
              max: 90,
            },

            {
              key: "short",
              label:
                "Short Break",
              min: 1,
              max: 30,
            },

            {
              key: "long",
              label:
                "Long Break",
              min: 1,
              max: 60,
            },
          ].map((item) => (
            <Slider
              key={item.key}
              label={item.label}
              value={d[item.key]}
              min={item.min}
              max={item.max}
              suffix=" dk"
              onChange={(v) =>
                setD({
                  ...d,
                  [item.key]: v,
                })
              }
            />
          ))}

          <button
            onClick={save}
            className="save-btn"
          >
            Save Settings
          </button>
        </Card>

        {/* APPEARANCE */}

        <Card>
          <SectionLabel>
            🌌 Appearance
          </SectionLabel>

          <Slider
            label="Glass Intensity"
            value={glass}
            min={0}
            max={40}
            onChange={(v) =>
              updateSettings({
                glass: v,
              })
            }
          />

          <Slider
            label="Blur Amount"
            value={blur}
            min={0}
            max={50}
            onChange={(v) =>
              updateSettings({
                blur: v,
              })
            }
          />

          <Slider
            label="Brightness"
            value={brightness}
            min={30}
            max={100}
            suffix="%"
            onChange={(v) =>
              updateSettings({
                brightness: v,
              })
            }
          />

          <Slider
            label="Dark Overlay"
            value={overlay}
            min={0}
            max={80}
            suffix="%"
            onChange={(v) =>
              updateSettings({
                overlay: v,
              })
            }
          />
        </Card>

        {/* AUDIO */}

        <Card>
          <SectionLabel>
            🔊 Audio
          </SectionLabel>

          <Slider
            label="Master Volume"
            value={masterVolume}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) =>
              updateSettings({
                masterVolume: v,
              })
            }
          />

          <Slider
            label="Ambient Volume"
            value={ambientVolume}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) =>
              updateSettings({
                ambientVolume: v,
              })
            }
          />

          <Toggle
            label="Sound Effects"
            value={soundEffects}
            onChange={(v) =>
              updateSettings({
                soundEffects: v,
              })
            }
          />
        </Card>

        {/* SCENES */}

        <Card>
          <SectionLabel>
            🎨 Scenes
          </SectionLabel>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(3,1fr)",

              gap: 14,
            }}
          >
            {SCENES.map((s, i) => (
              <button
                key={i}
                onClick={() =>
                  setSceneIndex(i)
                }
                className={`scene-card ${
                  sceneIndex === i
                    ? "selected"
                    : ""
                }`}
                style={{
                  borderColor:
                    s.accent,
                }}
              >
                <div
                  className="scene-glow"
                  style={{
                    background:
                      s.accent,
                  }}
                />

                <div
                  style={{
                    fontSize: 28,
                    color: s.accent,
                  }}
                >
                  {s.sym}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    marginTop: 8,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {s.name}
                </div>
              </button>
            ))}

            {/* UPLOAD */}

            <button
              className="scene-card"
              onClick={() =>
                fileRef.current.click()
              }
            >
              <Upload size={28} />

              <div
                style={{
                  fontSize: 12,
                  marginTop: 8,
                  fontWeight: 700,
                }}
              >
                Upload
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={
                  uploadBackground
                }
              />
            </button>
          </div>

          {customBackground && (
  <div
    style={{
      marginTop: 20,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        Custom Background
      </span>

      <button
        onClick={() =>
          updateSettings({
            customBackground: null,
          })
        }
        style={{
          border: "none",
          background: "rgba(239,68,68,0.15)",
          color: "#ef4444",
          borderRadius: 10,
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        Remove
      </button>
    </div>

    <div
      style={{
        height: 180,
        borderRadius: 18,
        backgroundImage: `url(${customBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    />
  </div>
)}
        </Card>

        {/* FOCUS */}

        <Card>
          <SectionLabel>
            🎯 Focus Mode
          </SectionLabel>

          <Toggle
            label="Auto Start Break"
            value={autoBreak}
            onChange={(v) =>
              updateSettings({
                autoBreak: v,
              })
            }
          />

          <Toggle
            label="Auto Start Focus"
            value={autoPomodoro}
            onChange={(v) =>
              updateSettings({
                autoPomodoro: v,
              })
            }
          />

          <Toggle
            label="Zen Mode"
            value={zenMode}
            onChange={(v) =>
              updateSettings({
                zenMode: v,
              })
            }
          />

          <Toggle
            label="Fullscreen Focus"
            value={fullscreen}
            onChange={(v) =>
              updateSettings({
                fullscreen: v,
              })
            }
          />
        </Card>

        {/* ACHIEVEMENTS */}

        <Card>
          <SectionLabel>
            🏆 Achievements
          </SectionLabel>

          <Toggle
            label="Badge Popup"
            value={badgePopup}
            onChange={(v) =>
              updateSettings({
                badgePopup: v,
              })
            }
          />

          <Toggle
            label="XP Animation"
            value={xpAnimation}
            onChange={(v) =>
              updateSettings({
                xpAnimation: v,
              })
            }
          />

          <Toggle
            label="Confetti"
            value={confetti}
            onChange={(v) =>
              updateSettings({
                confetti: v,
              })
            }
          />

          <Toggle
            label="Glow Effects"
            value={glowEffects}
            onChange={(v) =>
              updateSettings({
                glowEffects: v,
              })
            }
          />
        </Card>

        {/* AI */}

        <Card>
          <SectionLabel>
            🤖 AI Assistant
          </SectionLabel>

          <Toggle
            label="AI Motivation"
            value={aiMotivation}
            onChange={(v) =>
              updateSettings({
                aiMotivation: v,
              })
            }
          />

          <Toggle
            label="AI Daily Summary"
            value={aiSummary}
            onChange={(v) =>
              updateSettings({
                aiSummary: v,
              })
            }
          />

          <Toggle
            label="AI Focus Score"
            value={aiScore}
            onChange={(v) =>
              updateSettings({
                aiScore: v,
              })
            }
          />
        </Card>

        {/* DATA */}

        <Card>
          <SectionLabel>
            💾 Data
          </SectionLabel>

          <button
            className="action-btn"
            onClick={exportData}
          >
            <Download size={16} />
            Export Data
          </button>

          <button
            className="action-btn"
            onClick={() =>
              importRef.current.click()
            }
          >
            <UploadCloud size={16} />
            Import Data
          </button>

          <input
            ref={importRef}
            type="file"
            accept=".json"
            hidden
            onChange={handleImport}
          />
        </Card>

        {/* DANGER */}

        <Card>
          <SectionLabel>
            ⚠ Danger Zone
          </SectionLabel>

          <button
            className="danger-btn"
            onClick={() => {
              const ok =
                window.confirm(
                  "Tüm veriler silinsin mi?"
                );

              if (ok) {
                resetAllData();
              }
            }}
          >
            <Trash2 size={16} />
            Reset All Data
          </button>
        </Card>
      </div>
    </div>
  );
}