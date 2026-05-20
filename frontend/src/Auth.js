import React, { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setError('Lütfen e-posta adresinizi ve şifrenizi girin.');
        return;
      }
    } else {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        setError('Lütfen tüm alanları doldurun.');
        return;
      }
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const url = `http://localhost:5001${endpoint}`;

    const payload = isLogin 
      ? { email: email.trim(), password }
      : { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', 'dummy-login-token');
          localStorage.setItem('username', data.user?.firstName || 'Kullanıcı');
          onLoginSuccess();
        } else {
          setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          setIsLogin(true);
          setPassword('');
        }
      } else {
        if (data.detail && typeof data.detail === 'object') {
          setError(data.detail[0]?.msg || 'Veri doğrulama hatası.');
        } else if (typeof data.detail === 'string') {
          setError(data.detail);
        } else {
          setError(data.error || 'İşlem başarısız oldu.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Sunucuya bağlanılamadı. Lütfen backend sunucusunun açık olduğundan emin olun.');
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw',
      backgroundColor: '#0f0f17',
      display: 'flex', alignItems: 'center', center: 'center',
      justifyContent: 'center', fontFamily: "'Poppins', sans-serif", color: '#fff'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '0.5px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px', padding: '40px 30px', width: '360px',
        backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: 600 }}>
          kampüs<span style={{ color: '#a855f7' }}>{isLogin ? 'giriş' : 'kayıt'}</span>
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px', fontWeight: 600, letterSpacing: '0.05em' }}>İSİM</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Ahmet" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px', fontWeight: 600, letterSpacing: '0.05em' }}>SOYİSİM</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Yılmaz" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px', fontWeight: 600, letterSpacing: '0.05em' }}>E-POSTA</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="ornek@kampus.com" 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px', fontWeight: 600, letterSpacing: '0.05em' }}>ŞİFRE</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>

          {error && <div style={{ color: '#f87171', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>{error}</div>}
          {message && <div style={{ color: '#34d399', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>{message}</div>}

          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#a855f7', color: '#fff', fontWeight: 600, cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' }}>
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          {isLogin ? 'Hesabınız yok mu?' : 'Zaten üye misiniz?'} 
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} 
            style={{ color: '#a855f7', marginLeft: '5px', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;