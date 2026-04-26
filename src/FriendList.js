import React from 'react';

export default function FriendList({ onSendMessage }) {
  const friends = [
    { id: 1, name: "Ahmet Yılmaz", status: "Odaklanıyor", color: "#22c55e" },
    { id: 2, name: "Ayşe Demir", status: "Mola Veriyor", color: "#eab308" }
  ];

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.2)', 
      padding: '20px', 
      borderRadius: '20px', 
      marginTop: '20px',
      border: '2px solid red', // GÖRÜNÜP GÖRÜNMEDİĞİNİ ANLAMAK İÇİN KIRMIZI ÇERÇEVE
      width: '300px',
      zIndex: 999
    }}>
      <h3 style={{color: 'white'}}>Arkadaş Listesi Test</h3>
      {friends.map(f => (
        <div key={f.id} style={{color: 'white', marginBottom: '10px'}}>
          {f.name} - {f.status} 
          <button onClick={() => onSendMessage(f.name)}>🚀</button>
        </div>
      ))}
    </div>
  );
}