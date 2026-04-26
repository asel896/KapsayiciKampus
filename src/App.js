import React, { useState } from 'react';
import Timer from './Timer';
import FriendList from './FriendList';
import TodoList from './TodoList';
import { Menu, X } from 'lucide-react';

function App() {
  const [notification, setNotification] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSendMessage = (name) => {
    setNotification(`${name} kişisine motive edici bir mesaj gönderildi! 🚀`);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div style={{
      height: '100vh', width: '100vw',
      backgroundImage: `url('https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: "'Poppins', sans-serif", position: 'relative', overflow: 'hidden'
    }}>
      {/* KARARTMA KATMANI */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }}></div>

      {/* SOLDAKİ HAMBURGER BUTONU */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        style={{ 
          position: 'absolute', top: '30px', left: '30px', // Right yerine Left yaptık
          background: 'rgba(255,255,255,0.1)', border: 'none', padding: '12px', 
          borderRadius: '15px', cursor: 'pointer', color: 'white', zIndex: 10,
          transition: 'all 0.3s ease'
        }}
      >
        <Menu size={28} />
      </button>

      {/* SOL YAN MENÜ PANELİ */}
      <div style={{
        position: 'fixed', top: 0, 
        left: isMenuOpen ? '0' : '-450px', // Soldan içeri girmesi için left ayarlandı
        width: '400px', height: '100vh', background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(25px)', zIndex: 100, 
        transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)', // Animasyon yönü sola çekildi
        padding: '40px 25px', overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.1)' // Çizgi sağa alındı
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>kampüs<span style={{color: '#a855f7'}}>paneli</span></h2>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={32} />
          </button>
        </div>
        
        <TodoList />
        <FriendList onSendMessage={handleSendMessage} />
      </div>

      {/* ANA TIMER EKRANI */}
      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', opacity: 0.7, letterSpacing: '2px' }}>
          KAPSAYICI KAMPÜS
        </h1>
        <Timer />
      </div>

      {/* BİLDİRİM (Alt Merkez) */}
      {notification && (
        <div style={{ 
          position: 'fixed', bottom: '30px', backgroundColor: '#a855f7', 
          padding: '12px 25px', borderRadius: '15px', zIndex: 999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.5s'
        }}>
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;