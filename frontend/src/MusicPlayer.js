import React, { useState } from 'react';
import { Play, Pause, Video, Link as LinkIcon, Music, CloudRain, Coffee, Volume2 } from 'lucide-react';

const MusicPlayer = () => {
  const [videoUrl, setVideoUrl] = useState(''); 
  const [showInput, setShowInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const quickPlay = (id) => {
    setIsPlaying(false);
    setTimeout(() => {
      setVideoUrl(id);
      setIsPlaying(true);
      setShowInput(false);
    }, 200);
  };

  return (
    <div className="glass" style={{
      position: 'fixed', bottom: '30px', left: '30px', width: '350px',
      padding: '15px', borderRadius: '25px', zIndex: 10, background: 'rgba(0,0,0,0.85)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      
      <div style={{ display: 'none' }}>
        {isPlaying && videoUrl && (
          <iframe 
            width="0" height="0" 
            src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=0`} 
            allow="autoplay; encrypted-media"
            title="music-player"
          ></iframe>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ 
            width: '60px', height: '60px', borderRadius: '15px', 
            background: isPlaying ? '#a855f7' : '#ef4444', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer'
          }}
        >
          {isPlaying ? <Music color="white" /> : <Play color="white" fill="white" />}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>
            {isPlaying ? "Ses Açık 🎵" : "Müzik Durduruldu"}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <Coffee 
              size={18} cursor="pointer" 
              onClick={() => quickPlay('jfKfPfyJRdk')} 
              style={{ color: videoUrl === 'jfKfPfyJRdk' ? '#a855f7' : 'white' }}
            />
            <CloudRain 
              size={18} cursor="pointer" 
              onClick={() => quickPlay('mPZkdNFkNps')} 
              style={{ color: videoUrl === 'mPZkdNFkNps' ? '#a855f7' : 'white' }}
            />
            <LinkIcon 
              size={18} cursor="pointer" 
              onClick={() => setShowInput(!showInput)} 
            />
          </div>
        </div>
      </div>

      {showInput && (
        <input 
          autoFocus
          placeholder="YouTube Linkini Yapıştır ve Enter..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = e.target.value;
              let id = val;
              if (val.includes('v=')) id = val.split('v=')[1].split('&')[0];
              else if (val.includes('be/')) id = val.split('be/')[1].split('?')[0];
              quickPlay(id);
            }
          }}
          style={{
            width: '100%', marginTop: '12px', background: 'rgba(255,255,255,0.1)', 
            border: 'none', borderRadius: '10px', color: 'white', padding: '10px', fontSize: '0.8rem'
          }}
        />
      )}
    </div>
  );
};

export default MusicPlayer;