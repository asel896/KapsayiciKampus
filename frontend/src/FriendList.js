import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Zap, X, Send, Sparkles, Flame, Users, BookOpen, Paperclip, Mic, Volume2 } from 'lucide-react';

const INITIAL_FRIENDS = [
  { id: 1, name: 'Ahmet Yılmaz', avatar: 'AY', status: 'focus', remaining: '34 dk', streak: 5, subject: 'Matematik', avatarColor: '#6366f1', storyText: 'Matematik fonksiyonlar bitmek üzere, kahveye az kaldı... 📐🏃‍♂️' },
  { id: 2, name: 'Ayşe Demir', avatar: 'AD', status: 'break', remaining: '4 dk', streak: 3, subject: 'Fizik', avatarColor: '#ec4899', storyText: 'Fizik 2 vizelerine çalışanlar kulübü, uykum var ama devam ☕✨' },
  { id: 3, name: 'Can Öztürk', avatar: 'CÖ', status: 'idle', remaining: null, streak: 1, subject: 'Tarih', avatarColor: '#f59e0b', storyText: 'Bugünlük kütüphane mesaisi biter, herkese iyi çalışmalar 😴👋' },
  { id: 4, name: 'Selin Arslan', avatar: 'SA', status: 'focus', remaining: '52 dk', streak: 12, subject: 'Kimya', avatarColor: '#10b981', storyText: 'Laboratuvar raporu yazmaktan parmaklarım koptu 🧪🔬' },
];

const STATUS_META = {
  focus: { label: 'Odaklanıyor', dot: '#22c55e', bg: 'rgba(34,197,94,0.12)', text: '#86efac' },
  break: { label: 'Mola', dot: '#eab308', bg: 'rgba(234,179,8,0.12)', text: '#fde68a' },
  idle: { label: 'Çevrimdışı', dot: '#64748b', bg: 'rgba(100,116,139,0.1)', text: '#94a3b8' },
};

const RANDOM_STORIES = {
  focus: [
    "Kütüphane çok kalabalık ama kulaklığı taktım, dünyayı kapattım. 🔥",
    "Lineer cebir ödevleri sabaha yetişecek, acı yok rock'n roll! 📐✏️",
    "Son 10 sayfa kaldı, bitirip kahve ödülümü alacağım. ☕"
  ],
  break: [
    "Kütüphane bahçesinde temiz hava molası. Gelen var mı? 🌿☕",
    "Beynim yandı, kantinde çay sırasındayım şu an. 🍩",
    "Gözlerimi 5 dakika dinlendiriyorum, mola şart. 😴"
  ],
  idle: [
    "Bugünlük bu kadar yeter, eve kaçar ben. Yarın görüşürüz! 👋",
    "Yatağımdan kütüphanedekilere başarılar diliyorum. 🛌✨",
    "Mesai bitti, finallere kadar kütüphane yüzü görmek istemiyorum. 🚫"
  ]
};

const uid = () => Math.random().toString(36).slice(2);
const now = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

const Avatar = ({ initials, color, size = 40, pulse = false }) => (
  <div style={{ position: 'relative', flexShrink: 0 }}>
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}18`, border: `1.5px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color, fontFamily: "'Poppins', sans-serif"
    }}>
      {initials}
    </div>
    {pulse && (
      <span style={{
        position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%',
        background: '#22c55e', boxShadow: '0 0 0 2px #13131a', animation: 'pulseRing 1.8s ease-in-out infinite'
      }} />
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20,
      background: m.bg, fontSize: 10, fontWeight: 600, color: m.text, letterSpacing: '0.03em'
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
};

const StoryModal = ({ friend, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: '#09090d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 380, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' }}>
        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: '#a855f7', animation: 'storyProgress 4s linear forwards' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <Avatar initials={friend.avatar} color={friend.avatarColor} size={42} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{friend.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{STATUS_META[friend.status].label} Modunda</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '40px 24px', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', width: '100%' }}>
            <BookOpen size={36} color={friend.avatarColor} style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, color: '#f1f5f9' }}>"{friend.storyText}"</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>kampüspaneli hikayeler</div>
      </div>
    </div>
  );
};

const FriendCard = ({ friend, onChat, onMotivate, accent }) => {
  const [boosted, setBoosted] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.05)' }}>
      <Avatar initials={friend.avatar} color={friend.avatarColor} size={40} pulse={friend.status === 'focus'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{friend.name}</span>
          {friend.streak >= 3 && <span style={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 10, color: '#fb923c', fontWeight: 700 }}><Flame size={12} fill="#fb923c" />{friend.streak}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusBadge status={friend.status} /></div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => { setBoosted(true); onMotivate(friend); setTimeout(() => setBoosted(false), 1000); }} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: boosted ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={14} color={boosted ? '#a855f7' : 'rgba(255,255,255,0.4)'} />
        </button>
        <button onClick={() => onChat(friend)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={14} color="rgba(255,255,255,0.4)" />
        </button>
      </div>
    </div>
  );
};

export default function FriendList({ accent = '#a855f7' }) {
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [chatFriend, setChatFriend] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [typingUser, setTypingUser] = useState(null);

  const [chatHistories, setChatHistories] = useState(() => {
    return JSON.parse(localStorage.getItem('kampus_chat_histories')) || {
      1: [{ id: 'i-1', from: 'them', text: 'Selamlar! Bugün matematik odağım çok yüksek, harika gidiyor. 🔥', time: '14:22' }],
      2: [{ id: 'i-2', from: 'them', text: 'Biraz fizik çalıştıktan sonra kahve molası verdim, sen naptın?', time: '15:05' }],
    };
  });

  const [groupMessages, setGroupMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('kampus_group_chat')) || [
      { id: 'g-1', from: 'them', senderName: 'Ahmet Yılmaz', senderColor: '#6366f1', text: "Kütüphane alev alıyor bugün, yer kalmamış resmen.", time: '16:01' },
      { id: 'g-2', from: 'them', senderName: 'Ayşe Demir', senderColor: '#ec4899', text: "Ben cam kenarındayım, kalkacak olursam yerimi devrederim.", time: '16:04' }
    ];
  });

  useEffect(() => { localStorage.setItem('kampus_chat_histories', JSON.stringify(chatHistories)); }, [chatHistories]);
  useEffect(() => { localStorage.setItem('kampus_group_chat', JSON.stringify(groupMessages)); }, [groupMessages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const statuses = ['focus', 'break', 'idle'];
      const randomFriend = friends[Math.floor(Math.random() * friends.length)];
      const currentStatus = randomFriend.status;
      
      let nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
      while (nextStatus === currentStatus) {
        nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }

      const storyPool = RANDOM_STORIES[nextStatus];
      const nextStory = storyPool[Math.floor(Math.random() * storyPool.length)];
      const nextRemaining = nextStatus === 'focus' ? '45 dk' : nextStatus === 'break' ? '10 dk' : null;

      setFriends(prev => prev.map(f => {
        if (f.id === randomFriend.id) {
          return { ...f, status: nextStatus, remaining: nextRemaining, storyText: nextStory };
        }
        return f;
      }));

      if (nextStatus === 'break') {
        setTimeout(() => { setTypingUser(randomFriend.name); }, 1000);
        
        try {
          const res = await fetch('http://localhost:8000/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_message: "Mola moduna geçtim, kütüphane grubuna durumumla ilgili samimi ve kısa bir mesaj fırlat.",
              friend_name: randomFriend.name,
              friend_status: nextStatus,
              friend_subject: randomFriend.subject,
              chat_history: []
            })
          });
          const data = await res.json();
          setTypingUser(null);
          
          setGroupMessages(prev => [...prev, {
            id: uid(),
            from: 'them',
            senderName: randomFriend.name,
            senderColor: randomFriend.avatarColor,
            text: data.reply || data.response || "Mola verdim gençlik!",
            msgType: 'text',
            time: now()
          }]);
        } catch (err) {
          setTypingUser(null);
          console.error("Zamanlayıcı Grup Mesajı Hatası:", err);
        }
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [friends]);

  const handleSendMessage = async (friendId, payload) => {
    const currentFriend = friends.find(f => f.id === friendId);
    const newMsg = { id: uid(), from: 'me', text: payload.text, msgType: payload.type, fileUrl: payload.fileUrl, time: now() };
    const updated = [...(chatHistories[friendId] || []), newMsg];

    setChatHistories(prev => ({ ...prev, [friendId]: updated }));

    setTimeout(() => { setTypingUser(currentFriend.name); }, 400);

    try {
      const res = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: payload.text || (payload.type === 'image' ? "Şu soruya bir baksana kanka" : "Sana bir ses dosyası bıraktım kanka"),
          friend_name: currentFriend.name,
          friend_status: currentFriend.status,
          friend_subject: currentFriend.subject,
          chat_history: chatHistories[friendId] || [],
          image_base64: payload.type === 'image' ? payload.fileUrl : null
        })
      });
      
      const data = await res.json();
      setTypingUser(null);
      
      
      const finalReply = data.reply || data.response || "Soruyu inceliyorum kanka, bir saniye...";

      setChatHistories(latest => ({
        ...latest,
        [friendId]: [...(latest[friendId] || []), { id: uid(), from: 'them', text: finalReply, msgType: 'text', time: now() }]
      }));

    } catch (err) {
      setTypingUser(null);
      console.error("LLM Bağlantı Hatası:", err);
      setChatHistories(latest => ({
        ...latest,
        [friendId]: [...(latest[friendId] || []), { id: uid(), from: 'them', text: "⚠️ Backend'e bağlanamadım! Sunucunun açık ve .env dosyanın dolu olduğunu kontrol et.", msgType: 'text', time: now() }]
      }));
    }
  };

  const handleSendGroupMessage = async (payload) => {
    const newMsg = { id: uid(), from: 'me', text: payload.text, msgType: payload.type, fileUrl: payload.fileUrl, time: now() };
    setGroupMessages(prev => [...prev, newMsg]);

    const groupActors = friends.filter(f => f.id !== 3); 
    const actor = groupActors[Math.floor(Math.random() * groupActors.length)];

    setTimeout(() => { setTypingUser(actor.name); }, 500);

    try {
      const res = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: payload.text || (payload.type === 'image' ? "Millet şu soruya baksanıza bi" : "Grup için ses kaydı bıraktım"),
          friend_name: actor.name,
          friend_status: actor.status,
          friend_subject: actor.subject,
          chat_history: groupMessages,
          image_base64: payload.type === 'image' ? payload.fileUrl : null
        })
      });
      
      const data = await res.json();
      setTypingUser(null);

      const aiGroupMsg = {
        id: uid(),
        from: 'them',
        senderName: actor.name,
        senderColor: actor.avatarColor,
        text: data.reply || data.response || "Bu soru fena duruyor!",
        msgType: 'text',
        time: now()
      };
      setGroupMessages(prev => [...prev, aiGroupMsg]);

    } catch (err) {
      setTypingUser(null);
      console.error("Grup LLM Hatası:", err);
    }
  };

  const handleClearPrivateChat = (friendId) => {
    setChatHistories(prev => ({ ...prev, [friendId]: [] }));
  };

  const handleClearGroupChat = () => {
    setGroupMessages([]);
  };

  const filtered = filter === 'all' ? friends : friends.filter(f => f.status === filter);

  const ChatDrawer = ({ title, avatarComponent, onClose, accent, messages, onSendMessage, typingUser, placeholder, onClearChat }) => {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef(null);
    const endRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingUser]);

    const handleSend = () => {
      if (!input.trim()) return;
      onSendMessage({ type: 'text', text: input.trim() });
      setInput('');
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onSendMessage({ type: 'image', text: '', fileUrl: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const toggleRecording = async () => {
      if (isRecording) {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioChunksRef.current = [];
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onloadend = () => {
              onSendMessage({ type: 'audio', text: '🎵 Sesli Mesaj', fileUrl: reader.result });
            };
            reader.readAsDataURL(audioBlob);
            stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
        } catch (err) {
          console.error("Mikrofon erişim hatası:", err);
          onSendMessage({ type: 'audio', text: '🎵 Sesli Mesaj' });
          setIsRecording(false);
        }
      }
    };

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0 24px 24px', pointerEvents: 'none' }}>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', pointerEvents: 'all', backdropFilter: 'blur(4px)' }} />
        
        <div style={{
          position: 'relative', pointerEvents: 'all', width: 340, height: 480, background: '#13131a',
          border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          animation: 'slideUp .3s cubic-bezier(.16,1,.3,1)'
        }}>
          
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            {avatarComponent}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{title}</div>
            </div>
            {onClearChat && (
              <button 
                onClick={() => {
                  if (window.confirm("Bu sohbet geçmişini temizlemek istediğinize emin misiniz?")) {
                    onClearChat();
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: 4, marginRight: 4 }}
              >
                Temizle
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'none' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                {m.senderName && m.from !== 'me' && <span style={{ fontSize: 10, color: m.senderColor || '#aaa', marginBottom: 2, marginLeft: 4, fontWeight: 600 }}>{m.senderName}</span>}
                
                <div style={{
                  maxWidth: '75%', padding: m.msgType === 'image' ? '4px' : '10px 14px', borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.from === 'me' ? accent : 'rgba(255,255,255,0.06)',
                  color: m.from === 'me' ? '#000' : '#e2e8f0', fontSize: 13, fontWeight: 500, lineHeight: 1.4, overflow: 'hidden'
                }}>
                  {m.msgType === 'image' && (
                    <img src={m.fileUrl} alt="Soru Resmi" style={{ width: '100%', maxHeight: 180, borderRadius: 12, objectFit: 'cover', display: 'block' }} />
                  )}

                  {m.msgType === 'audio' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', minWidth: 140 }}>
                      <Volume2 size={16} color={m.from === 'me' ? '#000' : accent} />
                      <div style={{ flex: 1, height: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {[4,10,6,12,4,8,10,5,7,3,9].map((h, i) => (
                          <span key={i} style={{ width: 2, height: `${h}px`, background: m.from === 'me' ? '#000' : 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 10, opacity: 0.6 }}>0:04</span>
                    </div>
                  )}

                  
                  {(!m.msgType || m.msgType === 'text') && m.text}

                  <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4, textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.time}</div>
                </div>
              </div>
            ))}

            {typingUser && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animation: 'fadeIn 0.2s' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2, marginLeft: 4 }}>{typingUser} yazıyor</span>
                <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div className="typing-dot" style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out' }} />
                  <div className="typing-dot" style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out 0.2s' }} />
                  <div className="typing-dot" style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{ padding: '10px 12px 14px', display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            
            <button onClick={() => fileInputRef.current?.click()} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paperclip size={15} />
            </button>

            <button onClick={toggleRecording} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: isRecording ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)', color: isRecording ? '#ef4444' : 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Mic size={15} className={isRecording ? 'recording-pulse' : ''} />
            </button>

            <input
              value={isRecording ? '🎤 Ses kaydediliyor...' : input}
              disabled={isRecording}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={placeholder}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 50, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', color: isRecording ? '#ef4444' : '#fff', fontSize: 13, outline: 'none' }}
            />

            {!isRecording && (
              <button onClick={handleSend} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: accent, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.4); } 50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes storyProgress { from { width: 0%; } to { width: 100%; } }
        @keyframes typingBounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes recPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        .typing-dot { display: inline-block; }
        .recording-pulse { animation: recPulse 1s infinite ease-in-out; }
      `}</style>

      <div style={{ width: '100%', fontFamily: "'Poppins', sans-serif" }}>
        
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, borderBottom: '0.5px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none' }}>
          {friends.map(f => (
            <div key={f.id} onClick={() => setActiveStory(f)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}>
              <div style={{
                padding: 2, borderRadius: '50%',
                border: `2px solid ${f.status === 'focus' ? '#22c55e' : f.status === 'break' ? '#eab308' : 'rgba(255,255,255,0.1)'}`
              }}>
                <Avatar initials={f.avatar} color={f.avatarColor} size={44} />
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', width: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{f.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14, justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color={accent} /> Kampüs Çapında Odak
          </div>
          
          <button onClick={() => setIsGroupOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20,
            background: 'rgba(168,85,247,0.1)', border: '0.5px solid rgba(168,85,247,0.3)',
            color: '#c084fc', fontSize: 11, fontWeight: 600, cursor: 'pointer'
          }}>
            <Users size={12} /> Kütüphane Grubu
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {[ ['all', 'Tümü'], ['focus', '🔥 Odak'], ['break', '☕ Mola'] ].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              flex: 1, padding: '6px 0', borderRadius: 8,
              background: filter === val ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: filter === val ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
              border: `0.5px solid ${filter === val ? 'rgba(255,255,255,0.1)' : 'transparent'}`
            }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'none' }}>
          {filtered.map(f => (
            <FriendCard key={f.id} friend={f} onChat={setChatFriend} onMotivate={(fr) => handleSendMessage(fr.id, { type: 'text', text: "🚀 Sana süper bir motivasyon enerjisi gönderiyorum! ⚡" })} accent={accent} />
          ))}
        </div>
      </div>

      {activeStory && <StoryModal friend={activeStory} onClose={() => setActiveStory(null)} />}

      {chatFriend && (
        <ChatDrawer
          title={chatFriend.name}
          avatarComponent={<Avatar initials={chatFriend.avatar} color={chatFriend.avatarColor} size={36} pulse={chatFriend.status === 'focus'} />}
          messages={chatHistories[chatFriend.id] || []}
          onClose={() => setChatFriend(null)}
          accent={accent}
          typingUser={typingUser === chatFriend.name ? chatFriend.name : null}
          onSendMessage={(payload) => handleSendMessage(chatFriend.id, payload)}
          placeholder={`${chatFriend.name} kişisine yaz...`}
          onClearChat={() => handleClearPrivateChat(chatFriend.id)}
        />
      )}

      {isGroupOpen && (
        <ChatDrawer
          title="Kütüphane 3. Kat Sakinleri 🏛️"
          avatarComponent={<div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}><Users size={16} /></div>}
          messages={groupMessages}
          onClose={() => setIsGroupOpen(false)}
          accent={accent}
          typingUser={typingUser && typingUser !== chatFriend?.name ? typingUser : null}
          onSendMessage={handleSendGroupMessage}
          placeholder="Gruba mesaj gönder..."
          onClearChat={handleClearGroupChat}
        />
      )}
    </>
  );
}