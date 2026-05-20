import React, { useState } from 'react';
import Timer from './Timer';
import FriendList from './FriendList';
import TodoList from './TodoList';
import MusicPlayer from './MusicPlayer';
import BackgroundSelector from './BackgroundSelector';
import { Menu, X } from 'lucide-react';
// Logo hatası alıyorsan bu satırı kontrol et veya dosya yoksa kaldır
import logo from './logo.png'; 

function App() {
  const [notification, setNotification] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&q=80&w=1920');
  
  // EKSİK OLAN KISIM: Aktif görevi takip eden state
  const [activeTodo, setActiveTodo] = useState(null);

  const handleSendMessage = (name) => {
    setNotification(`${name} kişisine motive edici bir mesaj gönderildi! 🚀`);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleBgChange = (url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setBgImage(url);
    };
  };

  return (
    <div style={{
      height: '100vh', width: '100vw',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: "'Poppins', sans-serif", position: 'relative', overflow: 'hidden',
      transition: 'background-image 0.6s ease-in-out',
      backgroundColor: '#111' 
    }}>
      
      {/* SOL ÜST HAMBURGER */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        style={{ 
          position: 'absolute', top: '30px', left: '30px', 
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
          padding: '12px', borderRadius: '15px', cursor: 'pointer', color: 'white', zIndex: 10 
        }}
      >
        <Menu size={28} />
      </button>

      {/* SOL YAN PANEL */}
      <div style={{
        position: 'fixed', top: 0, left: isMenuOpen ? '0' : '-450px',
        width: '400px', height: '100vh', background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(25px)', zIndex: 100, transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '40px 25px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             {/* Logo hatası almamak için src kontrolü önemli */}
             <img src={logo} alt="Logo" style={{ width: '30px', height: '30px' }} />
             <h2 style={{ margin: 0 }}>kampüs<span style={{color: '#a855f7'}}>paneli</span></h2>
          </div>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={32} />
          </button>
        </div>

        {/* GÜNCELLEME: TodoList'e props'ları gönderiyoruz */}
        <TodoList 
          activeTodo={activeTodo} 
          setActiveTodo={setActiveTodo} 
        />

        <div style={{ marginTop: '30px' }}>
          <FriendList onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* ANA TIMER */}
      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', opacity: 0.7, letterSpacing: '4px' }}>
          KAPSAYICI KAMPÜS
        </div>
        {/* GÜNCELLEME: Timer'a (Pomodoro) aktif görevi gönderiyoruz */}
        <Timer activeTodo={activeTodo} />
      </div>

      <MusicPlayer />
      <BackgroundSelector onSelect={handleBgChange} />

      {notification && (
        <div style={{ 
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#a855f7', padding: '12px 25px', borderRadius: '15px', zIndex: 999 
        }}>
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;