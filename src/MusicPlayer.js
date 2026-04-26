import React, { useState } from 'react';
import { Play, Pause, Video, Link as LinkIcon, Volume2 } from 'lucide-react';

const MusicPlayer = () => {
  const [videoUrl, setVideoUrl] = useState('jfKfPfyJRdk'); 
  const [inputUrl, setInputUrl] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleUrlSubmit = (e) => {
    if (e.key === 'Enter') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = inputUrl.match(regExp);
      if (match && match[2].length === 11) {
        setVideoUrl(match[2]);
        setIsPlaying(true);
        setShowInput(false);
      }
      setInputUrl('');
    }
  };

  return (
    <div className="glass" style={{
      position: 'fixed', bottom: '30px', left: '30px', width: '320px',
      padding: '15px', borderRadius: '20px', display: 'flex',
      alignItems: 'center', gap: '15px', zIndex: 10, background: 'rgba(0,0,0,0.8)'
    }}>
      
      <div style={{ display: 'none' }}>
        {isPlaying && (
          <iframe
            width="0" height="0"
            src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1`}
            allow="autoplay"
          ></iframe>
        )}
      </div>

      {/* İkon ismini Video olarak değiştirdik */}
      <div 
        onClick={() => setShowInput(!showInput)}
        style={{ 
          width: '60px', height: '60px', borderRadius: '12px', 
          background: '#ef4444', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0 
        }}
      >
        <Video color="white" size={30} />
      </div>

      <div style={{ flex: 1 }}>
        {showInput ? (
          <input 
            autoFocus
            placeholder="YouTube linki..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleUrlSubmit}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '5px', color: 'white', fontSize: '0.8rem', padding: '5px', outline: 'none'
            }}
          />
        ) : (
          <>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'white' }}>
              {isPlaying ? "Müzik Çalıyor" : "Müzik Seç"}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>
              Link için ikona tıkla
            </div>
          </>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', marginTop: '5px' }}>
          <div onClick={() => setIsPlaying(!isPlaying)} style={{ cursor: 'pointer' }}>
            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
          </div>
          <LinkIcon size={16} onClick={() => setShowInput(!showInput)} cursor="pointer" style={{ opacity: 0.7 }} />
          <Volume2 size={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;