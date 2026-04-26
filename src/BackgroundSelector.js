import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const BackgroundSelector = ({ onSelect }) => {
  const backgrounds = [
    { id: 1, name: 'Paris Cafe', url: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=2070' },
    { id: 2, name: 'Yağmurlu Kütüphane', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070' },
    { id: 3, name: 'Minimalist Ofis', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070' },
    { id: 4, name: 'Gece Ormanı', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 10 }}>
      <div className="bg-menu" style={{ 
        display: 'flex', 
        gap: '10px', 
        background: 'rgba(0,0,0,0.6)', 
        padding: '10px', 
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {backgrounds.map((bg) => (
          <div 
            key={bg.id}
            onClick={() => onSelect(bg.url)}
            title={bg.name}
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundImage: `url(${bg.url})`,
              backgroundSize: 'cover',
              cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;