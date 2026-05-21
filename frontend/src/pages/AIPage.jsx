import React, { useState, useEffect, useRef, useMemo } from "react";
import { PageTitle, Card } from "../components/CommonUI/CommonUI";
import { useGlobal } from "../context/GlobalContext";
import "./AIPage.css";

export default function AIPage({ scene }) {
  const { sessions, tasks } = useGlobal();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("geminiKey") || "");
  const [keyInput, setKeyInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("aiMessages");
      return saved ? JSON.parse(saved) : [{ role: "assistant", text: "Merhaba! Ben senin AI odak koçunum 🎯", time: Date.now() }];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { localStorage.setItem("aiMessages", JSON.stringify(messages)); }, [messages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const totalMins = useMemo(() => (sessions || []).reduce((a, s) => a + (s.duration || 25), 0), [sessions]);
  const todayStr = new Date().toLocaleDateString("tr-TR");
  const todaySess = (sessions || []).filter((s) => s.date === todayStr).length;
  const streak = [...new Set((sessions || []).map((s) => s.date))].length;
  const completedTasks = (tasks || []).filter((t) => t.done).length;
  const productivityScore = Math.min(100, Math.round(totalMins / 10 + todaySess * 8 + completedTasks * 5));
  const mood = productivityScore > 75 ? "Yüksek Motivasyon" : productivityScore > 45 ? "Dengeli" : "Düşük Enerji";

  const buildContext = () => `Sen gelişmiş bir productivity AI coachusun. Veriler: Toplam:${(sessions || []).length}, Bugün:${todaySess}, Süre:${totalMins}, Seri:${streak}, Görev:${completedTasks}, Skor:${productivityScore}. Kısa ve premium bir dille cevap ver.`;

  const saveKey = () => { localStorage.setItem("geminiKey", keyInput.trim()); setApiKey(keyInput.trim()); setKeyInput(""); };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input.trim(), time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: buildContext() }] }, contents: [...history, { role: "user", parts: [{ text: userMsg.text }] }] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";
      setMessages((m) => [...m, { role: "assistant", text: reply, time: Date.now() }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "⚠️ API hatası: " + e.message, time: Date.now() }]);
    }
    setLoading(false);
  };

  if (!apiKey) return (
    <div className="ai-container">
      <PageTitle sub="Gemini destekli AI coach">AI Koç</PageTitle>
      <Card style={{ padding: 26 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 58, marginBottom: 12 }}>✨</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 10 }}>Gemini API Anahtarı</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 22 }}>AI koçu aktif etmek için API key gir</div>
        </div>
        <div className="ai-key-input-container">
          <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="AIza..." className="ai-key-input" />
          <button onClick={saveKey} style={{ background: scene.accent, color: "#111" }} className="ai-button">Kaydet</button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="ai-container">
      <PageTitle sub="AI Productivity Coach">AI Koç</PageTitle>
      <div className="insights-grid">
        {[{ label: "Score", val: productivityScore }, { label: "Bugün", val: todaySess }, { label: "Mood", val: mood }].map((x) => (
          <div key={x.label} className="insight-card">
            <div className="insight-value" style={{ color: scene.accent }}>{x.val}</div>
            <div className="insight-label">{x.label}</div>
          </div>
        ))}
      </div>
      <Card className="chat-card">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} style={{ justifyContent: m.role === "user" ? "flex-end" : "flex-start", display: "flex" }}>
              <div className="message-bubble" style={{ background: m.role === "user" ? `${scene.accent}30` : "rgba(255,255,255,0.06)" }}>
                <div>{m.text}</div>
                <div className="message-time">{new Date(m.time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            </div>
          ))}
          {loading && <div style={{ color: scene.accent, fontSize: 13 }}>AI düşünüyor...</div>}
          <div ref={bottomRef} />
        </div>
        <div className="quick-prompts">
          {["Bugünkü performansımı analiz et", "Odaklanmam neden düşüyor?", "Nasıl daha disiplinli olurum?", "Pomodoro verilerimi yorumla"].map((q) => (
            <button key={q} onClick={() => setInput(q)} className="quick-prompt-btn">{q}</button>
          ))}
        </div>
        <div className="chat-input-area">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="AI koçuna yaz..." className="chat-input" />
          <button onClick={sendMessage} disabled={loading} style={{ background: scene.accent, color: "#111" }} className="ai-button">→</button>
        </div>
      </Card>
    </div>
  );
}