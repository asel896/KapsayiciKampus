import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw, Settings, X, Trophy, Repeat, Volume2,
  Clock, Globe, User, LogIn, UserPlus, LogOut, Play,
} from 'lucide-react';

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const RADIUS = 108;
const CIRC   = 2 * Math.PI * RADIUS;

const MODE_LABELS  = { pomodoro: 'ODAKLAN', short: 'KISA ARA', long: 'UZUN ARA' };
const MODE_DISPLAY = { pomodoro: 'odaklan', short: 'kısa ara', long: 'uzun ara' };

const ACCENTS = [
  '#60a5fa','#f472b6','#a78bfa','#34d399',
  '#fb923c','#facc15','#e2e8f0','#f87171',
];

const ALARM_OPTIONS = [
  { label: 'Dijital Bip',    value: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { label: 'Boru Sesi',      value: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg' },
  { label: 'Mekanik Zil',    value: 'https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg' },
  { label: 'Çan',            value: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
  { label: 'Doğa — Kuşlar', value: 'https://actions.google.com/sounds/v1/animals/bird_calls.ogg' },
  { label: 'Tahta Vurma',    value: 'https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg' },
];

const NOTIF_OPTIONS = [
  { label: 'Kısa Bip',    value: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg' },
  { label: 'Hafif Tık',   value: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg' },
  { label: 'Dijital Ping', value: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg' },
  { label: 'Islık',       value: 'https://actions.google.com/sounds/v1/cartoon/siren_whistle.ogg' },
  { label: 'Kapalı',      value: '' },
];

const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));

/* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    style={{
      width: 40, height: 22, borderRadius: 11,
      background: on ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
      border: 'none', position: 'relative', cursor: 'pointer',
      transition: 'background .2s', flexShrink: 0,
    }}
  >
    <span style={{
      position: 'absolute', width: 16, height: 16, borderRadius: '50%',
      background: '#fff', top: 3, left: 3,
      transform: on ? 'translateX(18px)' : 'none', transition: 'transform .2s',
    }} />
  </button>
);

const NumInput = ({ value, onChange, min = 1, max = 180 }) => (
  <input
    type="number" min={min} max={max} value={value}
    onChange={e => onChange(parseInt(e.target.value) || min)}
    style={{
      width: 76, padding: '8px 12px',
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: 8, color: '#fff', fontSize: 14, textAlign: 'center', outline: 'none',
    }}
  />
);

const AuthInput = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      width: '100%', padding: '12px 14px', boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.05)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none',
      ...style,
    }}
  />
);

const IconBtn = ({ onClick, title, children }) => (
  <button
    onClick={onClick} title={title}
    style={{
      width: 44, height: 44, borderRadius: '50%',
      border: '0.5px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'all .2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
  >
    {children}
  </button>
);

const SidebarItem = ({ id, active, onClick, icon, label, accent }) => (
  <div
    onClick={() => onClick(id)}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
      fontSize: 13, fontWeight: 500,
      color: active ? '#fff' : 'rgba(255,255,255,0.4)',
      background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
      transition: 'all .15s',
    }}
  >
    <span style={{ color: active ? accent : 'rgba(255,255,255,0.4)' }}>{icon}</span>
    {label}
  </div>
);

/* gradient-filled range track */
const VolumeSlider = ({ value, onChange, accent }) => (
  <input
    type="range" min={0} max={100} step={1} value={value}
    onChange={e => onChange(parseInt(e.target.value))}
    style={{
      width: '100%', height: 4, borderRadius: 2,
      appearance: 'none', outline: 'none', cursor: 'pointer',
      background: `linear-gradient(to right, ${accent} ${value}%, rgba(255,255,255,0.12) ${value}%)`,
    }}
  />
);

/* stat card shown above clock */
const StatWidget = ({ icon, label, value, sub, color }) => (
  <div style={{
    flex: 1, minWidth: 110,
    background: 'rgba(255,255,255,0.04)',
    border: `0.5px solid ${color}33`,
    borderRadius: 16, padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: 5,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      color, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{sub}</div>}
  </div>
);

/* single sound option row */
const SoundCard = ({ option, selected, onSelect, onPreview }) => (
  <div
    onClick={() => onSelect(option.value)}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 13px', borderRadius: 10, cursor: 'pointer',
      background: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      border: `0.5px solid ${selected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
      transition: 'all .15s',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: selected ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
        flexShrink: 0, transition: 'background .15s',
      }} />
      <span style={{ fontSize: 13, color: selected ? '#fff' : 'rgba(255,255,255,0.5)' }}>
        {option.label}
      </span>
    </div>
    {option.value && (
      <button
        onClick={e => { e.stopPropagation(); onPreview(option.value); }}
        title="Önizle"
        style={{
          width: 26, height: 26, borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.08)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.5)', transition: 'all .15s', flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
      >
        <Play size={10} fill="currentColor" />
      </button>
    )}
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
const Timer = () => {
  const [settings, setSettings] = useState({
    pomodoro: 60, short: 5, long: 15,
    autoCycle: true, cycleBeforeLong: 4,
    accent: '#60a5fa',
    alarmSound:   ALARM_OPTIONS[0].value,
    alarmVolume:  70,
    notifSound:   NOTIF_OPTIONS[0].value,
    notifVolume:  50,
  });

  const [mode,     setMode]     = useState('pomodoro');
  const [minutes,  setMinutes]  = useState(60);
  const [seconds,  setSeconds]  = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [cyclePos,      setCyclePos]      = useState(1);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab,      setActiveTab]      = useState('tema');
  const [user,           setUser]           = useState(null);
  const [authMode,       setAuthMode]       = useState('login');
  const [authForm,       setAuthForm]       = useState({ firstName: '', lastName: '', email: '', password: '' });

  const alarmRef    = useRef(null);
  const notifRef    = useRef(null);
  const previewRef  = useRef(null);
  const tickRef     = useRef(null);
  const minRef      = useRef(minutes);
  const secRef      = useRef(seconds);
  const modeRef     = useRef(mode);
  const settingsRef = useRef(settings);
  const cyclePosRef = useRef(cyclePos);

  minRef.current      = minutes;
  secRef.current      = seconds;
  modeRef.current     = mode;
  settingsRef.current = settings;
  cyclePosRef.current = cyclePos;

  useEffect(() => { document.documentElement.style.setProperty('--accent', settings.accent); }, [settings.accent]);
  useEffect(() => {
    document.body.style.backgroundColor = '#0c0c0f';
    document.body.style.color = '#fff';
    return () => { document.body.style.backgroundColor = ''; document.body.style.color = ''; };
  }, []);

  const playAlarm = useCallback(() => {
    const s = settingsRef.current;
    if (alarmRef.current && s.alarmSound) {
      alarmRef.current.src    = s.alarmSound;
      alarmRef.current.volume = clamp(s.alarmVolume / 100, 0, 1);
      alarmRef.current.play().catch(() => {});
    }
  }, []);

  const playNotif = useCallback(() => {
    const s = settingsRef.current;
    if (notifRef.current && s.notifSound) {
      notifRef.current.src    = s.notifSound;
      notifRef.current.volume = clamp(s.notifVolume / 100, 0, 1);
      notifRef.current.play().catch(() => {});
    }
  }, []);

  const advanceMode = useCallback((curMode, curCyclePos) => {
    let next;
    if (curMode === 'pomodoro') {
      setPomodoroCount(p => p + 1);
      if (curCyclePos >= settingsRef.current.cycleBeforeLong) {
        setCyclePos(1);
        next = 'long';
      } else {
        setCyclePos(p => p + 1);
        next = 'short';
      }
    } else {
      next = 'pomodoro';
    }
    
    // Otomatik döngü açıksa bir sonraki modu başlat
    if (settingsRef.current.autoCycle) {
      setIsActive(true);
    }
    return next;
  }, []);

  useEffect(() => {
    if (!isActive) { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(() => {
      if (secRef.current > 0) {
        setSeconds(s => s - 1);
      } else if (minRef.current > 0) {
        setMinutes(m => m - 1); setSeconds(59);
      } else {
        clearInterval(tickRef.current);
        playAlarm();
        
        const next = advanceMode(modeRef.current, cyclePosRef.current);
        setMode(next);
        setMinutes(settingsRef.current[next]);
        setSeconds(0);
        playNotif();

        // Eğer otomatik döngü kapalıysa durdur, açıksa advanceMode içindeki setIsActive devam ettirecek
        if (!settingsRef.current.autoCycle) {
          setIsActive(false);
        }
      }
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [isActive, advanceMode, playAlarm, playNotif]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!isActive) { setMinutes(settings[mode]); setSeconds(0); } }, [settings.pomodoro, settings.short, settings.long]);

  const switchMode = m => { clearInterval(tickRef.current); setIsActive(false); setMode(m); setMinutes(settings[m]); setSeconds(0); };
  const resetTimer = () => { clearInterval(tickRef.current); setIsActive(false); setMinutes(settings[mode]); setSeconds(0); };

  const previewSound = src => {
    if (!src) return;
    if (previewRef.current) { previewRef.current.pause(); previewRef.current.currentTime = 0; }
    previewRef.current = new Audio(src);
    previewRef.current.volume = 0.6;
    previewRef.current.play().catch(() => {});
  };

  const S          = settings;
  const accent     = S.accent;
  const totalSec   = S[mode] * 60;
  const elapsed    = totalSec - (minutes * 60 + seconds);
  const dashOffset = CIRC * (1 - (totalSec > 0 ? elapsed / totalSec : 0));

  const handleAuth = () => {
    const { email, password, firstName } = authForm;
    if (!email || !password || (authMode === 'signup' && !firstName)) { alert('Lütfen zorunlu alanları doldurun.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Geçerli bir e-posta giriniz.'); return; }
    if (password.length < 6) { alert('Şifre en az 6 karakter olmalıdır.'); return; }
    setUser({ email, name: firstName || email.split('@')[0] });
  };
  const handleLogout = () => { setUser(null); setAuthForm({ firstName: '', lastName: '', email: '', password: '' }); setAuthMode('login'); };

  /* ── SETTINGS TAB CONTENT ── */
  const renderTab = () => {
    switch (activeTab) {

      case 'tema':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hazır renkler</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {ACCENTS.map(c => (
                  <div key={c} onClick={() => setSettings(s => ({ ...s, accent: c }))} style={{
                    width: 34, height: 34, borderRadius: '50%', background: c, cursor: 'pointer',
                    border: `2px solid ${accent === c ? '#fff' : 'transparent'}`,
                    transform: accent === c ? 'scale(1.15)' : 'none', transition: 'all .15s',
                  }} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Özel renk</p>
              <input type="color" value={accent} onChange={e => setSettings(s => ({ ...s, accent: e.target.value }))}
                style={{ width: 56, height: 34, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8 }} />
            </div>
          </div>
        );

      case 'zaman':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[['Pomodoro (dk)', 'pomodoro'], ['Kısa ara (dk)', 'short'], ['Uzun ara (dk)', 'long']].map(([label, key]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
                <NumInput value={S[key]} onChange={v => setSettings(s => ({ ...s, [key]: v }))} />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Otomatik döngü</span>
              <Toggle on={S.autoCycle} onChange={v => setSettings(s => ({ ...s, autoCycle: v }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Uzun aradan önce</span>
              <NumInput value={S.cycleBeforeLong} min={1} max={10} onChange={v => setSettings(s => ({ ...s, cycleBeforeLong: v }))} />
            </div>
          </div>
        );

      case 'ses':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

            {/* alarm */}
            <section>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Alarm sesi
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {ALARM_OPTIONS.map(o => (
                  <SoundCard key={o.value} option={o}
                    selected={S.alarmSound === o.value}
                    onSelect={v => setSettings(s => ({ ...s, alarmSound: v }))}
                    onPreview={previewSound}
                  />
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Alarm ses seviyesi</span>
                  <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{S.alarmVolume}%</span>
                </div>
                <VolumeSlider value={S.alarmVolume} onChange={v => setSettings(s => ({ ...s, alarmVolume: v }))} accent={accent} />
              </div>
            </section>

            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />

            {/* bildirim */}
            <section>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Bildirim sesi (mod geçişi)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {NOTIF_OPTIONS.map(o => (
                  <SoundCard key={o.value || 'off'} option={o}
                    selected={S.notifSound === o.value}
                    onSelect={v => setSettings(s => ({ ...s, notifSound: v }))}
                    onPreview={previewSound}
                  />
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Bildirim ses seviyesi</span>
                  <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{S.notifVolume}%</span>
                </div>
                <VolumeSlider value={S.notifVolume} onChange={v => setSettings(s => ({ ...s, notifVolume: v }))} accent={accent} />
              </div>
            </section>
          </div>
        );

      case 'hesap':
        return user ? (
          <div style={{ background: 'rgba(99,235,160,0.07)', border: '0.5px solid rgba(99,235,160,0.2)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Giriş yapıldı</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{user.email}</p>
            <p style={{ fontSize: 13, color: '#63eba0', marginTop: 4 }}>{user.name}</p>
            <button onClick={handleLogout} style={{ marginTop: 14, padding: '10px 24px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,80,80,0.15)', border: '0.5px solid rgba(255,80,80,0.25)', color: '#ff8080', fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={14} /> Çıkış yap
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 2 }}>{authMode === 'login' ? 'Giriş yap' : 'Kayıt ol'}</p>
            {authMode === 'signup' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <AuthInput placeholder="İsim"    value={authForm.firstName} onChange={e => setAuthForm(f => ({ ...f, firstName: e.target.value }))} />
                <AuthInput placeholder="Soyisim" value={authForm.lastName}  onChange={e => setAuthForm(f => ({ ...f, lastName:  e.target.value }))} />
              </div>
            )}
            <AuthInput type="email"    placeholder="E-posta"               value={authForm.email}    onChange={e => setAuthForm(f => ({ ...f, email:    e.target.value }))} />
            <AuthInput type="password" placeholder="Şifre (min 6 karakter)" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} />
            <button onClick={handleAuth} style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', cursor: 'pointer', background: accent, color: '#000', fontSize: 14, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {authMode === 'login' ? <><LogIn size={16} /> Giriş Yap</> : <><UserPlus size={16} /> Kaydol</>}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              {authMode === 'login' ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}{' '}
              <span onClick={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')} style={{ color: accent, cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>
                {authMode === 'login' ? 'Kaydol' : 'Giriş yap'}
              </span>
            </p>
          </div>
        );

      default: return null;
    }
  };

  const SIDEBAR_ITEMS = [
    { id: 'tema',  label: 'Görünüm',     icon: <Globe   size={16} /> },
    { id: 'zaman', label: 'Zamanlayıcı', icon: <Clock   size={16} /> },
    { id: 'ses',   label: 'Sesler',      icon: <Volume2 size={16} /> },
    { id: 'hesap', label: 'Hesap',       icon: <User    size={16} /> },
  ];

  /* ── RENDER ── */
  return (
    <>
      <style>{`
        :root { --accent: ${accent}; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #0c0c0f !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; cursor: pointer; border: 2px solid var(--accent); }
        input[type=range]::-moz-range-thumb    { width: 14px; height: 14px; border-radius: 50%; background: #fff; cursor: pointer; border: 2px solid var(--accent); }
        .mode-btn { transition: background .2s, color .2s; }
        .mode-btn:hover { opacity: .85; }
        .main-btn:hover { opacity: .85; transform: scale(1.02); }
        .main-btn:active { transform: scale(.98); }
      `}</style>

      <audio ref={alarmRef} />
      <audio ref={notifRef} />

      {/* PAGE */}
      <div style={{
        minHeight: '100vh', background: '#0c0c0f',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#fff', padding: '2rem 1rem',
      }}>

        {/* STAT WIDGETS */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.75rem', width: '100%', maxWidth: 400 }}>
          <StatWidget
            icon={<Trophy size={12} />} label="Skor" color="#facc15"
            value={pomodoroCount}
            sub={pomodoroCount === 0 ? 'Henüz yok' : `${pomodoroCount} pomodoro`}
          />
          <StatWidget
            icon={<Repeat size={12} />} label="Set" color={accent}
            value={`${cyclePos} / ${S.cycleBeforeLong}`}
            sub={`${S.cycleBeforeLong - cyclePos + (cyclePos <= S.cycleBeforeLong ? 0 : 0)} set kaldı`}
          />
          {user && (
            <StatWidget
              icon={<User size={12} />} label="Kullanıcı" color="#63eba0"
              value={user.name} sub={user.email}
            />
          )}
        </div>

        {/* MODE TABS */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: 5, gap: 4, marginBottom: '2.5rem' }}>
          {['pomodoro', 'short', 'long'].map(m => (
            <button key={m} className="mode-btn" onClick={() => switchMode(m)} style={{
              padding: '9px 22px', borderRadius: 40, border: 'none',
              background: mode === m ? accent : 'transparent',
              color: mode === m ? '#000' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: mode === m ? 600 : 500, cursor: 'pointer', letterSpacing: '0.02em',
            }}>
              {MODE_DISPLAY[m]}
            </button>
          ))}
        </div>

        {/* CLOCK RING */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <svg width={240} height={240} viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={120} cy={120} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
            <circle cx={120} cy={120} r={RADIUS} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={CIRC} strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke .4s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '4rem', fontWeight: 600, letterSpacing: -2, lineHeight: 1, color: accent }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6, letterSpacing: '0.12em' }}>
              {MODE_LABELS[mode]}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <IconBtn onClick={resetTimer} title="Sıfırla"><RotateCcw size={18} /></IconBtn>
          <button className="main-btn" onClick={() => setIsActive(a => !a)} style={{
            padding: '16px 52px', borderRadius: 50, border: 'none',
            background: accent, color: '#000', fontSize: '1rem', fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all .2s',
          }}>
            {isActive ? 'DURDUR' : 'BAŞLAT'}
          </button>
          <IconBtn onClick={() => setIsSettingsOpen(true)} title="Ayarlar"><Settings size={18} /></IconBtn>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#111114', width: 'min(92vw, 600px)', borderRadius: 24, border: '0.5px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', maxHeight: '85vh' }}>

            {/* sidebar */}
            <div style={{ width: 180, minWidth: 180, padding: '24px 12px', borderRight: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SIDEBAR_ITEMS.map(item => (
                <SidebarItem key={item.id} id={item.id} active={activeTab === item.id}
                  onClick={setActiveTab} icon={item.icon} label={item.label} accent={accent} />
              ))}
            </div>

            {/* body */}
            <div style={{ flex: 1, padding: 28, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                  {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}
                </span>
                <button onClick={() => setIsSettingsOpen(false)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', border: 'none' }}>
                  <X size={14} />
                </button>
              </div>

              <div style={{ flex: 1 }}>{renderTab()}</div>

              <button onClick={() => { setIsSettingsOpen(false); resetTimer(); }} style={{ width: '100%', padding: 13, borderRadius: 50, border: 'none', cursor: 'pointer', background: accent, color: '#000', fontSize: 14, fontWeight: 600, marginTop: 24, transition: 'opacity .2s' }}>
                Kaydet ve kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;