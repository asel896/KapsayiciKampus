export const formatTime = (seconds = 0) => {
  /* =========================================================
     SAFE VALUE
  ========================================================= */

  const safeSeconds = Math.max(
    0,
    Math.floor(seconds)
  );

  /* =========================================================
     CALCULATE
  ========================================================= */

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const remainingSeconds =
    safeSeconds % 60;

  /* =========================================================
     FORMAT
  ========================================================= */

  const hh = hours
    .toString()
    .padStart(2, "0");

  const mm = minutes
    .toString()
    .padStart(2, "0");

  const ss = remainingSeconds
    .toString()
    .padStart(2, "0");

  /* =========================================================
     RETURN
  ========================================================= */

  return hours > 0
    ? `${hh}:${mm}:${ss}`
    : `${mm}:${ss}`;
};

/* =========================================================
   EXTRA HELPERS
========================================================= */

export const formatMinutes = (
  minutes = 0
) => {
  if (minutes < 60)
    return `${minutes} dk`;

  const h = Math.floor(minutes / 60);

  const m = minutes % 60;

  if (m === 0) return `${h} sa`;

  return `${h} sa ${m} dk`;
};

export const percentage = (
  value,
  total
) => {
  if (!total) return 0;

  return Math.round(
    (value / total) * 100
  );
};

export const clamp = (
  value,
  min,
  max
) => {
  return Math.min(
    Math.max(value, min),
    max
  );
};

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12)
    return "Günaydın ☀️";

  if (hour < 18)
    return "İyi günler 🌤";

  return "İyi akşamlar 🌙";
};

export const generateId = () => {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
};