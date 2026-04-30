import React, { useState } from 'react';
import { ImageIcon, Sparkles } from 'lucide-react';

const BackgroundSelector = ({ onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageIds = [
    { id: '1517816743773-6e0fd518b4a6', name: 'Paris Cafe' },
    { id: '1507842217343-583bb7270b66', name: 'Yağmurlu Kütüphane' },
    { id: '1497215728101-856f4ea42174', name: 'Minimalist Ofis' },
    { id: '1502082553048-f009c37129b9', name: 'Gece Ormanı' }, 
    { id: '1454496522488-7a8e488e8606', name: 'Karlı Dağ Evi' }, 
    { id: '1441974231531-c6227db76b6e', name: 'Sonbahar Parkı' },
    { id: '1519608487953-e999c86e7455', name: 'Siberpunk Şehir' },
    { id: '1503899036084-c55cdd92da26', name: 'Tokyo Gecesi' },
    { id: '1449824913935-59a10b8d2000', name: 'New York Çatısı' },
    { id: '1436891620584-47fd0e565afb', name: 'Yıldızlı Gökyüzü' },
    { id: '1523906834658-6e24ef2386f9', name: 'Venedik Kanalları' }, 
    { id: '1516383274235-5f42d6c6426d', name: 'Retro Masası' },
    { id: '1540959733332-eab4deabeeaf', name: 'Lo-Fi Oda' },
    { id: '1495474472287-4d71bcdd2085', name: 'Kahve Kokusu' },
    { id: '1461360370896-922624d12aa1', name: 'Plak Çalar' },
    { id: '1515377905703-c4788e51af15', name: 'Zen Köşesi' },
    { id: '1550684848-fac1c5b4e853', name: 'Mavi Estetik' },
    { id: '1483347756197-71ef80e95f73', name: 'Kuzey Işıkları' },
    { id: '1507525428034-b723cf961d3e', name: 'Sahil Gün Batımı' },
    { id: '1469474968028-56623f02e42e', name: 'Bulutların Üstü' },
    { id: '1446776811953-b23d57bd21aa', name: 'Karanlık Uzay' },
    {id: '1506744038136-46273834b3fb', name: 'Sarı Çiçekler' },
  ];

  return (
    <div 
      style={{ 
        position: 'fixed', bottom: '25px', right: '25px', zIndex: 100,
        transition: 'all 0.4s ease', transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
        opacity: isHovered ? 1 : 0.8
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        background: 'rgba(15, 15, 20, 0.9)', padding: '16px', borderRadius: '24px',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxWidth: '240px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#a855f7" /> Arka Planlar
          </span>
        </div>
        <div className="bg-grid-scroll" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', 
          maxHeight: '200px', overflowY: 'auto', paddingRight: '5px'
        }}>
          {imageIds.map((img) => (
            <div 
              key={img.id}
              onClick={() => onSelect(`https://images.unsplash.com/photo-${img.id}?auto=format&fit=crop&q=80&w=1920`)}
              title={img.name}
              style={{ 
                width: '44px', height: '44px', borderRadius: '10px', 
                backgroundImage: `url(https://images.unsplash.com/photo-${img.id}?auto=format&fit=crop&q=60&w=100)`,
                backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer',
                border: '2px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', backgroundColor: '#222'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          ))}
        </div>
      </div>
      <style>{`
        .bg-grid-scroll::-webkit-scrollbar { width: 4px; }
        .bg-grid-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BackgroundSelector;