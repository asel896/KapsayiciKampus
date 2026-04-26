import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, X, Trophy, Repeat } from 'lucide-react';

const Timer = ({ onModeChange, onRunningChange }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('zamanlayicilar');
  
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [cyclePos, setCyclePos] = useState(1);

  const [settings, setSettings] = useState({
    pomodoro: 25,
    short: 5,
    long: 15,
    autoCycle: true,
    cycleBeforeLong: 4
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
          playSound("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
          
          if (settings.autoCycle) {
            let nextMode;
            if (mode === 'pomodoro') {
              setPomodoroCount(prev => prev + 1);
              if (cyclePos >= settings.cycleBeforeLong) {
                nextMode = 'long';
                setCyclePos(1);
              } else {
                nextMode = 'short';
                setCyclePos(prev => prev + 1);
              }
            } else {
              nextMode = 'pomodoro';
            }
            setMode(nextMode);
            setMinutes(settings[nextMode]);
            setSeconds(0);
            if (onModeChange) onModeChange(nextMode === 'pomodoro' ? 'work' : 'break');
          } else {
            setIsActive(false);
            if (onRunningChange) onRunningChange(false);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode, settings, cyclePos, onModeChange, onRunningChange]);

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
      
      {/* 1. ÜST PANEL (SKOR VE SET) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '15px', backdropFilter: 'blur(5px)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={16} color="#facc15" /> Skor: {pomodoroCount}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '15px', backdropFilter: 'blur(5px)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Repeat size={16} color="#a855f7" /> Set: {cyclePos}/{settings.cycleBeforeLong}
        </div>
      </div>

      {/* 2. MOD SEÇİCİ (GERİ GELDİ!) */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
        {[
          { id: 'pomodoro', label: 'odaklan' },
          { id: 'short', label: 'kısa ara' },
          { id: 'long', label: 'uzun ara' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => changeMode(m.id)}
            style={{
              padding: '10px 25px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: mode === m.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
              color: mode === m.id ? '#000' : '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)',
              transition: '0.3s'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 3. DEV SAAT */}
      <div style={{ fontSize: '13rem', fontWeight: '800', letterSpacing: '-8px', textShadow: '0 20px 50px rgba(0,0,0,0.4)', lineHeight: '1' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* 4. ANA KONTROLLER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
        <button 
          onClick={() => { playSound("https://actions.google.com/sounds/v1/ui/simple_click.ogg"); setIsActive(!isActive); if(onRunningChange) onRunningChange(!isActive); }}
          style={{ padding: '18px 60px', borderRadius: '50px', border: 'none', backgroundColor: 'white', color: 'black', fontSize: '1.6rem', fontWeight: '800', cursor: 'pointer' }}
        >
          {isActive ? 'durdur' : 'başlangıç'}
        </button>
        <RotateCcw size={35} cursor="pointer" onClick={() => {setIsActive(false); setMinutes(settings[mode]); setSeconds(0);}} />
        <Settings size={35} cursor="pointer" onClick={() => setIsSettingsOpen(true)} />
      </div>

      {/* 5. GELİŞMİŞ AYARLAR MODALI */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#000', width: '750px', height: '500px', borderRadius: '30px', display: 'flex', position: 'relative', border: '1px solid #222', color: '#fff', textAlign: 'left' }}>
            
            <X size={24} style={{ position: 'absolute', top: '25px', right: '25px', cursor: 'pointer', color: '#666' }} onClick={() => setIsSettingsOpen(false)} />
            
            <div style={{ width: '250px', padding: '50px 40px', borderRight: '1px solid #111' }}>
              {['Genel', 'Zamanlayıcılar', 'Sesler', 'Hesap'].map(tab => (
                <div key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ marginBottom: '25px', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer', color: activeTab === tab.toLowerCase() ? '#fff' : '#666', position: 'relative' }}>
                  {tab}
                  {activeTab === tab.toLowerCase() && <div style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%', height: '2px', background: '#fff' }} />}
                </div>
              ))}
            </div>

            <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                {['pomodoro', 'short', 'long'].map(type => (
                  <div key={type} style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block', marginBottom: '10px' }}>{type === 'pomodoro' ? 'Pomodoro' : type === 'short' ? 'Kısa Ara' : 'Uzun Ara'}</label>
                    <input type="number" value={settings[type]} onChange={(e) => setSettings({...settings, [type]: parseInt(e.target.value) || 0})} style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '15px', borderRadius: '12px', fontSize: '1.3rem' }} />
                    <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '5px' }}>dakika</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flex: 1 }}>
                <div onClick={() => setSettings({...settings, autoCycle: !settings.autoCycle})} style={{ width: '56px', height: '30px', background: settings.autoCycle ? '#fff' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: settings.autoCycle ? '29px' : '3px', width: '24px', height: '24px', background: settings.autoCycle ? '#000' : '#fff', borderRadius: '50%', transition: '0.3s' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>Pomodoro tekniğini kullanın: Pomodoro → kısa ara, {settings.cycleBeforeLong} kez tekrarlayın, ardından uzun bir ara.</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                <button onClick={() => setSettings({pomodoro: 25, short: 5, long: 15, autoCycle: true, cycleBeforeLong: 4})} style={{ color: '#ff4d4d', background: 'none', border: '1px solid #300', padding: '12px 25px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer' }}>Tümünü sıfırla</button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsSettingsOpen(false)} style={{ background: '#222', color: '#fff', border: 'none', padding: '12px 35px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer' }}>Kapalı</button>
                  <button onClick={() => { setIsSettingsOpen(false); setMinutes(settings[mode]); }} style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 35px', borderRadius: '50px', fontWeight: '800', cursor: 'pointer' }}>Değişiklikleri kaydet</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;