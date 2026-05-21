import React from "react";
import { NAV_ITEMS } from "../constants";

export default function Navbar({
  active,
  setActive,
  scene,
}) {
  return (
    <nav
      style={{
        position: "sticky",
        bottom: 24,

        width: "fit-content",

        margin: "40px auto 0",

        zIndex: 50,

        display: "flex",
        alignItems: "center",
        gap: 4,

        padding: "8px",

        borderRadius: 999,

        background:
          "rgba(10,10,15,0.55)",

        backdropFilter: "blur(30px)",
        WebkitBackdropFilter:
          "blur(30px)",

        border:
          "1px solid rgba(255,255,255,0.08)",

        boxShadow: `
          0 20px 60px rgba(0,0,0,.45),
          inset 0 1px 0 rgba(255,255,255,.05)
        `,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const activeItem =
          active === item.id;

        return (
          <button
            key={item.id}
            onClick={() =>
              setActive(item.id)
            }
            title={item.label}
            style={{
              position: "relative",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              gap: 10,

              border: "none",
              cursor: "pointer",

              padding: activeItem
                ? "12px 18px"
                : "12px",

              minWidth: activeItem
                ? 110
                : 48,

              borderRadius: 999,

              overflow: "hidden",

              transition:
                "all .35s cubic-bezier(.22,1,.36,1)",

              background: activeItem
                ? `${scene.accent}18`
                : "transparent",

              boxShadow: activeItem
                ? `0 0 30px ${scene.accent}30`
                : "none",

              border: activeItem
                ? `1px solid ${scene.accent}35`
                : "1px solid transparent",
            }}
          >
            {/* Glow */}

            {activeItem && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background: `
                    radial-gradient(
                      circle at center,
                      ${scene.accent}22 0%,
                      transparent 75%
                    )
                  `,

                  pointerEvents:
                    "none",
                }}
              />
            )}

            {/* Icon */}

            <span
              style={{
                position: "relative",
                zIndex: 2,

                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",

                fontSize: activeItem
                  ? 18
                  : 16,

                color: activeItem
                  ? scene.accent
                  : "rgba(255,255,255,.45)",

                transition:
                  "all .3s ease",

                transform: activeItem
                  ? "translateY(-1px) scale(1.08)"
                  : "scale(1)",
              }}
            >
              {item.icon}
            </span>

            {/* Label */}

            <span
              style={{
                position: "relative",
                zIndex: 2,

                fontSize: 12,
                fontWeight: 700,

                letterSpacing: ".04em",

                whiteSpace: "nowrap",

                color: activeItem
                  ? "white"
                  : "rgba(255,255,255,.35)",

                maxWidth: activeItem
                  ? 120
                  : 0,

                opacity: activeItem
                  ? 1
                  : 0,

                overflow: "hidden",

                transition:
                  "all .35s ease",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}