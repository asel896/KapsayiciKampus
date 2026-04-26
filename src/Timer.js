import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, X, Trophy } from 'lucide-react'; // Trophy ikonu ekledik

const Timer = ({ onModeChange, onRunningChange }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // YENİ: Bugün kaç pomodoro yapıldı?
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [settings, setSettings] = useState({
    pomodoro: 25,
    short: 5,
    long: 15
  });

  const playSound = (url) => {
    const audio = new Audio(url);
    audio.play().catch(e => {});
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1);
        else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // --- SÜRE BİTTİĞİNDE ---
          playSound("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
          
          let nextMode;
          if (mode === 'pomodoro') {
            nextMode = 'short';
            // Odaklanma bittiği için sayacı 1 artırıyoruz 🚀
            setPomodoroCount(prev => prev + 1);
          } else {
            nextMode = 'pomodoro';
          }

          setMode(nextMode);
          setMinutes(settings[nextMode]);
          setSeconds(0);
          
          if (onModeChange) onModeChange(nextMode === 'pomodoro' ? 'work' : 'break');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode, settings, onModeChange]);

  const changeMode = (newMode) => {
    playSound("https://actions.google.com/sounds/v1/ui/click_v0.ogg");
    setMode(newMode);
    setMinutes(settings[newMode]);
    setSeconds(0);
    setIsActive(false);
    if (onModeChange) onModeChange(newMode === 'pomodoro' ? 'work' : 'break');
    if (onRunningChange) onRunningChange(false);
  };

  return (
    <div className="animate-fade" style={{ textAlign: 'center', color: 'white' }}>
      
      {/* SAYAÇ GÖSTERGESİ (Yeni Eklendi) */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        background: 'rgba(255,255,255,0.1)', width: 'fit-content', margin: '0 auto 20px',
        padding: '8px 20px', borderRadius: '20px', backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Trophy size={18} color="#facc15" />
        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Bugünkü Skor: {pomodoroCount}</span>
      </div>

      {/* MOD SEÇİCİ */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
        {['pomodoro', 'short', 'long'].map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            style={{
              padding: '10px 25px', borderRadius: '30px', border: 'none',
              backgroundColor: mode === m ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
              color: mode === m ? '#000' : '#fff', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(5px)'
            }}
          >
            {m === 'pomodoro' ? 'odaklan' : m === 'short' ? 'kısa ara' : 'uzun ara'}
          </button>
        ))}
      </div>

      {/* DEV SAAT */}
      <div style={{ fontSize: '13rem', fontWeight: '800', letterSpacing: '-8px', textShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* KONTROLLER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
        <button 
          onClick={() => {
            playSound("https://actions.google.com/sounds/v1/ui/simple_click.ogg");
            setIsActive(!isActive);
            if (onRunningChange) onRunningChange(!isActive);
          }}
          style={{ padding: '18px 60px', borderRadius: '50px', border: 'none', backgroundColor: 'white', color: 'black', fontSize: '1.6rem', fontWeight: '800', cursor: 'pointer' }}
        >
          {isActive ? 'durdur' : 'başlangıç'}
        </button>
        
        <RotateCcw size={35} cursor="pointer" onClick={() => {setIsActive(false); setMinutes(settings[mode]); setSeconds(0);}} />
        <Settings size={35} cursor="pointer" onClick={() => setIsSettingsOpen(true)} />
      </div>

      {/* AYARLAR MODALI AYNI KALDI... */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="glass" style={{ padding: '40px', borderRadius: '30px', width: '350px', position: 'relative', background: 'rgba(30,30,30,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <X size={24} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} onClick={() => setIsSettingsOpen(false)} />
            <h2 style={{ marginBottom: '30px' }}>Süre Ayarları</h2>
            {['pomodoro', 'short', 'long'].map(type => (
              <div key={type} style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px' }}>{type} (dk)</label>
                <input 
                  type="number" 
                  value={settings[type]} 
                  onChange={(e) => setSettings({...settings, [type]: parseInt(e.target.value) || 0})}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1.1rem' }}
                />
              </div>
            ))}
            <button 
              onClick={() => { setIsSettingsOpen(false); setMinutes(settings[mode]); }}
              style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#9333ea', color: 'white', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;