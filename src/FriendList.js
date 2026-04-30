import React, { useState, useEffect, useRef } from 'react';

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const INITIAL_FRIENDS = [
  {
    id: 1, name: 'Ahmet Yılmaz', avatar: 'AY',
    status: 'focus',   remaining: '34 dk',
    streak: 5, subject: 'Matematik', avatarColor: '#6366f1',
  },
  {
    id: 2, name: 'Ayşe Demir', avatar: 'AD',
    status: 'break',   remaining: '4 dk',
    streak: 3, subject: 'Fizik', avatarColor: '#ec4899',
  },
  {
    id: 3, name: 'Can Öztürk', avatar: 'CÖ',
    status: 'idle',    remaining: null,
    streak: 1, subject: 'Tarih', avatarColor: '#f59e0b',
  },
  {
    id: 4, name: 'Selin Arslan', avatar: 'SA',
    status: 'focus',   remaining: '52 dk',
    streak: 12, subject: 'Kimya', avatarColor: '#10b981',
  },
];

const MOTIVATIONAL = [
  '🔥 Harika gidiyorsun!',
  '💪 Sen yapabilirsin!',
  '⚡ Odak modu: aktif!',
  '🎯 Hedefine yaklaşıyorsun!',
  '🚀 Bugün çok üretkensin!',
  '✨ İnanılmaz bir çalışma serisi!',
  '🌟 Gurur duyuyorum!',
  '💡 Dahisin sen!',
  '🏆 Şampiyon edasıyla!',
  '🎉 Bunu kutlayalım!',
];

const STATUS_META = {
  focus: { label: 'Odaklanıyor', dot: '#22c55e', bg: 'rgba(34,197,94,0.12)', text: '#86efac' },
  break: { label: 'Mola',        dot: '#eab308', bg: 'rgba(234,179,8,0.12)',  text: '#fde68a' },
  idle:  { label: 'Çevrimdışı',  dot: '#64748b', bg: 'rgba(100,116,139,0.1)', text: '#94a3b8' },
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2);
const now  = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

/* ─── TINY COMPONENTS ────────────────────────────────────────── */
const Avatar = ({ initials, color, size = 40, pulse = false }) => (
  <div style={{ position: 'relative', flexShrink: 0 }}>
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}22`,
      border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {initials}
    </div>
    {pulse && (
      <span style={{
        position: 'absolute', bottom: 1, right: 1,
        width: 9, height: 9, borderRadius: '50%',
        background: '#22c55e',
        boxShadow: '0 0 0 2px #0c0c0f',
        animation: 'pulseRing 1.8s ease-in-out infinite',
      }} />
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      background: m.bg, fontSize: 11, fontWeight: 600,
      color: m.text, letterSpacing: '0.03em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
};

/* ─── CHAT DRAWER ────────────────────────────────────────────── */
const ChatDrawer = ({ friend, onClose, accent }) => {
  const [msgs, setMsgs]   = useState([
    { id: uid(), from: 'them', text: 'Selamlar! Bugün çok verimli geçiyor 🔥', time: '14:22' },
  ]);
  const [input, setInput] = useState('');
  const endRef            = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const sendMsg = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { id: uid(), from: 'me', text, time: now() }]);
    setInput('');
    // auto-reply after 1.2s
    setTimeout(() => {
      const replies = ['Teşekkürler! 😊', 'Haha evet 💪', 'Seninle çalışmak motivasyon veriyor!', '🙌🙌'];
      setMsgs(m => [...m, { id: uid(), from: 'them', text: replies[Math.floor(Math.random() * replies.length)], time: now() }]);
    }, 1200);
  };

  const sendMotivation = () => {
    const msg = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
    sendMsg(msg);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
      padding: '0 24px 24px',
      pointerEvents: 'none',
    }}>
      {/* backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', pointerEvents: 'all', backdropFilter: 'blur(2px)' }} />

      {/* drawer */}
      <div style={{
        position: 'relative', pointerEvents: 'all',
        width: 340, height: 480,
        background: '#13131a',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: 20, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        animation: 'slideUp .25s cubic-bezier(.16,1,.3,1)',
      }}>
        {/* header */}
        <div style={{
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <Avatar initials={friend.avatar} color={friend.avatarColor} size={36} pulse={friend.status === 'focus'} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{friend.name}</div>
            <StatusBadge status={friend.status} />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
        </div>

        {/* messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {msgs.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%',
                padding: '9px 13px', borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.from === 'me' ? accent : 'rgba(255,255,255,0.07)',
                color: m.from === 'me' ? '#000' : '#e2e8f0',
                fontSize: 13, fontWeight: 500, lineHeight: 1.45,
              }}>
                {m.text}
                <div style={{ fontSize: 10, opacity: 0.55, marginTop: 3, textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* quick motivational */}
        <div style={{ padding: '6px 12px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['🔥 Harika!', '💪 Devam!', '🎯 Odaklan!'].map(t => (
            <button key={t} onClick={() => sendMsg(t)} style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: `0.5px solid ${accent}44`,
              background: `${accent}11`, color: accent, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {t}
            </button>
          ))}
          <button onClick={sendMotivation} style={{
            flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            🎲 Rastgele
          </button>
        </div>

        {/* input */}
        <div style={{ padding: '10px 12px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
            placeholder="Mesaj yaz..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 50,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: '#fff', fontSize: 13, outline: 'none',
            }}
          />
          <button onClick={() => sendMsg(input)} style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none',
            background: accent, color: '#000', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            flexShrink: 0,
          }}>
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── FRIEND CARD ────────────────────────────────────────────── */
const FriendCard = ({ friend, onChat, onMotivate, accent }) => {
  const [boosted, setBoosted] = useState(false);

  const handleMotivate = () => {
    setBoosted(true);
    onMotivate(friend);
    setTimeout(() => setBoosted(false), 1800);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 14,
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid rgba(255,255,255,0.07)',
      transition: 'all .2s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      <Avatar initials={friend.avatar} color={friend.avatarColor} size={42} pulse={friend.status === 'focus'} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {friend.name}
          </span>
          {friend.streak >= 3 && (
            <span title={`${friend.streak} günlük seri`} style={{ fontSize: 11, color: '#fb923c', fontWeight: 700 }}>
              🔥{friend.streak}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <StatusBadge status={friend.status} />
          {friend.remaining && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {friend.remaining} kaldı
            </span>
          )}
        </div>
        {friend.subject && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
            📚 {friend.subject}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {/* motivate */}
        <button
          onClick={handleMotivate}
          title="Motivasyon gönder"
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: boosted ? 'rgba(251,146,60,0.25)' : 'rgba(255,255,255,0.06)',
            cursor: 'pointer', fontSize: 15, transition: 'all .2s',
            transform: boosted ? 'scale(1.25)' : 'scale(1)',
          }}
        >
          {boosted ? '🚀' : '⚡'}
        </button>
        {/* chat */}
        <button
          onClick={() => onChat(friend)}
          title="Mesaj gönder"
          style={{
            width: 32, height: 32, borderRadius: '50%', border: `0.5px solid ${accent}44`,
            background: `${accent}15`, cursor: 'pointer', color: accent,
            fontSize: 14, transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}30`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${accent}15`; }}
        >
          💬
        </button>
      </div>
    </div>
  );
};

/* ─── TOAST ──────────────────────────────────────────────────── */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: '#1e1e2e', border: '0.5px solid rgba(255,255,255,0.12)',
      borderRadius: 50, padding: '10px 20px', fontSize: 13, fontWeight: 500,
      color: '#e2e8f0', zIndex: 3000, whiteSpace: 'nowrap',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'fadeInUp .3s ease',
    }}>
      {msg}
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function FriendList({ accent = '#60a5fa' }) {
  const [friends]    = useState(INITIAL_FRIENDS);
  const [chatFriend, setChatFriend] = useState(null);
  const [toast,      setToast]      = useState(null);
  const [filter,     setFilter]     = useState('all');

  const showToast = (msg) => { setToast(msg); };

  const handleMotivate = (friend) => {
    const msg = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
    showToast(`${friend.name}'e gönderildi: ${msg}`);
  };

  const focusCount = friends.filter(f => f.status === 'focus').length;

  const filtered = filter === 'all'
    ? friends
    : friends.filter(f => f.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulseRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.6); }
          50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div style={{
        width: 320, fontFamily: "'DM Sans', sans-serif",
        background: '#0f0f17',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>

        {/* HEADER */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                Kampüs
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                {focusCount} kişi şu an odaklanıyor
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 20,
              background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.2)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulseRing 1.8s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#86efac' }}>{focusCount} aktif</span>
            </div>
          </div>

          {/* FILTER TABS */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
            {[['all', 'Tümü'], ['focus', '🔥 Odak'], ['break', '☕ Mola']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                flex: 1, padding: '6px 0', borderRadius: 8, border: 'none',
                background: filter === val ? `${accent}20` : 'rgba(255,255,255,0.04)',
                color: filter === val ? accent : 'rgba(255,255,255,0.4)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `0.5px solid ${filter === val ? accent + '44' : 'transparent'}`,
                transition: 'all .15s',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* FRIEND LIST */}
        <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 380, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
              Bu kategoride kimse yok
            </div>
          )}
          {filtered.map(f => (
            <FriendCard
              key={f.id} friend={f}
              onChat={setChatFriend}
              onMotivate={handleMotivate}
              accent={accent}
            />
          ))}
        </div>

        {/* FOOTER CTA */}
        <div style={{
          padding: '12px 14px',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <button
            onClick={() => {
              const active = friends.filter(f => f.status === 'focus');
              if (active.length) {
                active.forEach(f => handleMotivate(f));
                showToast(`🚀 ${active.length} kişiye toplu motivasyon gönderildi!`);
              }
            }}
            style={{
              width: '100%', padding: '10px', borderRadius: 10, border: 'none',
              background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
              borderTop: `0.5px solid ${accent}33`,
              color: accent, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.04em', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accent}25`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accent}22, ${accent}11)`; }}
          >
            ⚡ Herkese Motivasyon Gönder
          </button>
        </div>
      </div>

      {/* CHAT DRAWER */}
      {chatFriend && (
        <ChatDrawer friend={chatFriend} onClose={() => setChatFriend(null)} accent={accent} />
      )}

      {/* TOAST */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}