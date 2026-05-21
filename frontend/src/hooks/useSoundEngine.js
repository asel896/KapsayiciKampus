import { useRef } from 'react';

export const useSoundEngine = () => {
  const audioCtxRef = useRef(null);
  const activeSourcesRef = useRef({});

  const initCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playDoneSound = () => {
    initCtx();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    [523, 659, 784].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      const startTime = ctx.currentTime + index * 0.18;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  };

  const startAmbient = (type) => {
    initCtx();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    if (activeSourcesRef.current[type]) {
      stopAmbient(type);
    }

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    if (type === "rain") {
      filter.type = "lowpass";
      filter.frequency.value = 1000;
      gainNode.gain.value = 0.45;
    } else if (type === "wind") {
      filter.type = "bandpass";
      filter.frequency.value = 400;
      filter.Q.value = 3.0;
      gainNode.gain.value = 0.25;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      activeSourcesRef.current[`${type}_lfo`] = lfo;
    } else if (type === "campfire") {
      filter.type = "lowpass";
      filter.frequency.value = 250;
      gainNode.gain.value = 0.6;

      const crackleInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.value = 100 + Math.random() * 600;
          oscGain.gain.setValueAtTime(0, ctx.currentTime);
          oscGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.002);
          oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      }, 90);
      activeSourcesRef.current[`${type}_interval`] = crackleInterval;
    } else if (type === "brown") {
      // Brown Noise: Derin ve tok odak sesi
      filter.type = "lowpass";
      filter.frequency.value = 300;
      gainNode.gain.value = 0.5;
    }

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseNode.start();

    activeSourcesRef.current[type] = noiseNode;
    activeSourcesRef.current[`${type}_gain`] = gainNode;
  };

  const stopAmbient = (type) => {
    if (activeSourcesRef.current[type]) {
      try { activeSourcesRef.current[type].stop(); } catch(e){}
      delete activeSourcesRef.current[type];
    }
    if (activeSourcesRef.current[`${type}_gain`]) {
      delete activeSourcesRef.current[`${type}_gain`];
    }
    if (activeSourcesRef.current[`${type}_lfo`]) {
      try { activeSourcesRef.current[`${type}_lfo`].stop(); } catch(e){}
      delete activeSourcesRef.current[`${type}_lfo`];
    }
    if (activeSourcesRef.current[`${type}_interval`]) {
      clearInterval(activeSourcesRef.current[`${type}_interval`]);
      delete activeSourcesRef.current[`${type}_interval`];
    }
  };

  return { playDoneSound, startAmbient, stopAmbient, activeAmbient: activeSourcesRef.current };
};