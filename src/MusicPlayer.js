import React, { useState } from 'react';
import { Play, SkipBack, SkipForward, Volume2, Plus } from 'lucide-react';

const MusicPlayer = () => {
  return (
    <div className="glass" style={{
      position: 'fixed',
      bottom: '30px',
      left: '30px',
      width: '320px',
      padding: '15px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      zIndex: 10,
      background: 'rgba(0,0,0,0.6)'
    }}>
      {/* Albüm Kapak Resmi (Örnekteki gibi) */}
      <img 
        src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop" 
        alt="cover" 
        style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '2px' }}>Lofi Study Beats</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Kapsayıcı Kampüs Radyo</div>
        
        {/* Kontrol Tuşları */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
          <SkipBack size={16} cursor="pointer" />
          <Play size={20} fill="white" cursor="pointer" />
          <SkipForward size={16} cursor="pointer" />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', opacity: 0.7 }}>
             <Plus size={16} cursor="pointer" />
             <Volume2 size={16} cursor="pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;