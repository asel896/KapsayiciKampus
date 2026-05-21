import { useState, useEffect, useRef } from "react";

export const useTimer = (
  initialSeconds = 1500
) => {
  /* =========================================================
     STATES
  ========================================================= */

  const [timeLeft, setTimeLeft] =
    useState(initialSeconds);

  const [isActive, setIsActive] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [progress, setProgress] =
    useState(1);

  /* =========================================================
     REFS
  ========================================================= */

  const intervalRef = useRef(null);

  const initialRef = useRef(
    initialSeconds
  );

  /* =========================================================
     UPDATE INITIAL
  ========================================================= */

  useEffect(() => {
    initialRef.current =
      initialSeconds;
  }, [initialSeconds]);

  /* =========================================================
     TIMER LOOP
  ========================================================= */

  useEffect(() => {
    if (!isActive) return;

    intervalRef.current =
      setInterval(() => {
        setTimeLeft((prev) => {
          /* TIMER END */

          if (prev <= 1) {
            clearInterval(
              intervalRef.current
            );

            setIsActive(false);

            setIsPaused(false);

            return 0;
          }

          return prev - 1;
        });
      }, 1000);

    return () => {
      clearInterval(
        intervalRef.current
      );
    };
  }, [isActive]);

  /* =========================================================
     PROGRESS
  ========================================================= */

  useEffect(() => {
    setProgress(
      timeLeft /
        initialRef.current
    );
  }, [timeLeft]);

  /* =========================================================
     TOGGLE
  ========================================================= */

  const toggle = () => {
    setIsActive((prev) => {
      const next = !prev;

      setIsPaused(!next);

      return next;
    });
  };

  /* =========================================================
     START
  ========================================================= */

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  /* =========================================================
     PAUSE
  ========================================================= */

  const pause = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const reset = (
    seconds = initialRef.current
  ) => {
    clearInterval(
      intervalRef.current
    );

    setIsActive(false);

    setIsPaused(false);

    setTimeLeft(seconds);

    initialRef.current =
      seconds;
  };

  /* =========================================================
     ADD TIME
  ========================================================= */

  const addMinute = () => {
    setTimeLeft((prev) => prev + 60);
  };

  const subtractMinute = () => {
    setTimeLeft((prev) =>
      Math.max(0, prev - 60)
    );
  };

  /* =========================================================
     SEEK
  ========================================================= */

  const seek = (seconds) => {
    setTimeLeft(
      Math.max(0, seconds)
    );
  };

  /* =========================================================
     FORMATTERS
  ========================================================= */

  const minutes = Math.floor(
    timeLeft / 60
  )
    .toString()
    .padStart(2, "0");

  const seconds = (
    timeLeft % 60
  )
    .toString()
    .padStart(2, "0");

  const formatted = `${minutes}:${seconds}`;

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    /* STATES */
    timeLeft,
    isActive,
    isPaused,
    progress,

    /* FORMAT */
    formatted,

    /* CONTROLS */
    start,
    pause,
    toggle,
    reset,
    seek,

    /* EXTRA */
    addMinute,
    subtractMinute,

    /* RAW */
    setTimeLeft,
    setIsActive,
  };
};