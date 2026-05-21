import React, { useState, useEffect } from "react";

export default function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={{ fontSize: "6rem", fontWeight: "bold", textAlign: "center" }}>
      {formatTime(timeLeft)}
    </div>
  );
}