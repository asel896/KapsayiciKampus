import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Flag, BookOpen, Zap, Star, Target } from 'lucide-react';

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',    label: 'Tümü',    icon: <Target size={13} /> },
  { id: 'study',  label: 'Ders',    icon: <BookOpen size={13} /> },
  { id: 'task',   label: 'Görev',   icon: <Zap size={13} /> },
  { id: 'goal',   label: 'Hedef',   icon: <Star size={13} /> },
];

const PRIORITIES = [
  { id: 'high',   label: 'Yüksek', color: '#f87171' },
  { id: 'medium', label: 'Orta',   color: '#fb923c' },
  { id: 'low',    label: 'Düşük',  color: '#60a5fa' },
];

const CATEGORY_COLORS = {
  study: '#a78bfa',
  task:  '#34d399',
  goal:  '#fbbf24',
};

/* ─── TASK ITEM ──────────────────────────────────────────────── */
const TaskItem = ({ task, onToggle, onDelete, accent }) => {
  const [removing, setRemoving] = useState(false);
  const pColor = PRIORITIES.find(p => p.id === task.priority)?.color || accent;
  const cColor = CATEGORY_COLORS[task.category] || 'rgba(255,255,255,0.3)';

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 280);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 12,
      background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
      border: `0.5px solid ${task.completed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'}`,
      transition: 'all .28s cubic-bezier(.16,1,.3,1)',
      opacity: removing ? 0 : task.completed ? 0.55 : 1,
      transform: removing ? 'translateX(12px) scale(0.97)' : 'none',
    }}>
      {/* priority stripe */}
      <div style={{ width: 3, height: 28, borderRadius: 2, background: task.completed ? 'rgba(255,255,255,0.1)' : pColor, flexShrink: 0, transition: 'background .3s' }} />

      {/* check */}
      <button
        onClick={() => onToggle(task.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0, color: task.completed ? accent : 'rgba(255,255,255,0.25)', transition: 'color .2s' }}
      >
        {task.completed
          ? <CheckCircle size={18} fill={accent} color={accent} />
          : <Circle size={18} />
        }
      </button>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 13, fontWeight: task.completed ? 400 : 500,
          color: task.completed ? 'rgba(255,255,255,0.35)' : '#e2e8f0',
          textDecoration: task.completed ? 'line-through' : 'none',
          display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'all .3s',
        }}>
          {task.text}
        </span>
        <span style={{ fontSize: 10, color: cColor, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8 }}>
          {CATEGORIES.find(c => c.id === task.category)?.label}
        </span>
      </div>

      {/* delete */}
      <button
        onClick={handleDelete}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          color: 'rgba(255,255,255,0.18)', transition: 'color .2s', display: 'flex', flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.18)'; }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────── */
const TodoList = ({ accent = '#60a5fa' }) => {
  const [tasks,       setTasks]    = useState([
    { id: 1, text: 'Türev konusunu bitir', category: 'study', priority: 'high',   completed: false },
    { id: 2, text: 'Haftalık özet çıkar',  category: 'goal',  priority: 'medium', completed: false },
    { id: 3, text: 'Lab raporunu teslim et', category: 'task', priority: 'high',  completed: true  },
  ]);
  const [input,       setInput]    = useState('');
  const [category,    setCategory] = useState('study');
  const [priority,    setPriority] = useState('medium');
  const [filter,      setFilter]   = useState('all');
  const [adding,      setAdding]   = useState(false);
  const inputRef = useRef(null);

  const total     = tasks.length;
  const done      = tasks.filter(t => t.completed).length;
  const progress  = total > 0 ? Math.round((done / total) * 100) : 0;

  const filtered = filter === 'all'
    ? tasks
    : filter === 'done'
    ? tasks.filter(t => t.completed)
    : tasks.filter(t => !t.completed && t.category === filter);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = { id: Date.now(), text: input.trim(), category, priority, completed: false };
    setTasks(prev => [newTask, ...prev]);
    setInput('');
    setAdding(false);
  };

  const toggleTask  = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask  = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const clearDone   = ()   => setTasks(prev => prev.filter(t => !t.completed));

  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .todo-scroll::-webkit-scrollbar { width: 3px; }
        .todo-scroll::-webkit-scrollbar-track { background: transparent; }
        .todo-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes expandDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 200px; }
        }
      `}</style>

      <div style={{
        width: '100%', fontFamily: "'DM Sans', sans-serif",
        background: '#0f0f17',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 20, overflow: 'hidden',
      }}>

        {/* ── HEADER ── */}
        <div style={{ padding: '16px 16px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                Odak Hedefleri
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                {done} / {total} tamamlandı
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {done > 0 && (
                <button onClick={clearDone} style={{
                  padding: '5px 10px', borderRadius: 8, border: '0.5px solid rgba(248,113,113,0.25)',
                  background: 'rgba(248,113,113,0.08)', color: '#fca5a5',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}>
                  Temizle
                </button>
              )}
              <button onClick={() => setAdding(a => !a)} style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: adding ? `${accent}30` : `${accent}20`,
                color: accent, cursor: 'pointer', fontSize: 18, fontWeight: 300,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s',
              }}>
                {adding ? '−' : '+'}
              </button>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accent}, ${accent}bb)`,
              borderRadius: 2, transition: 'width .5s cubic-bezier(.16,1,.3,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>{progress}%</span>
          </div>
        </div>

        {/* ── ADD FORM ── */}
        {adding && (
          <div style={{
            padding: '12px 14px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            animation: 'expandDown .2s ease',
          }}>
            {/* text input */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Görev yaz..."
                style={{
                  flex: 1, padding: '9px 13px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: `0.5px solid ${accent}44`,
                  color: '#fff', fontSize: 13, outline: 'none',
                }}
              />
              <button onClick={addTask} style={{
                padding: '9px 16px', borderRadius: 10, border: 'none',
                background: accent, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              }}>
                <Plus size={15} /> Ekle
              </button>
            </div>

            {/* category + priority */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Kategori</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <button key={c.id} onClick={() => setCategory(c.id)} style={{
                      flex: 1, padding: '5px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                      background: category === c.id ? `${CATEGORY_COLORS[c.id]}22` : 'rgba(255,255,255,0.04)',
                      color: category === c.id ? CATEGORY_COLORS[c.id] : 'rgba(255,255,255,0.35)',
                      fontSize: 10, fontWeight: 600, transition: 'all .15s',
                      border: `0.5px solid ${category === c.id ? CATEGORY_COLORS[c.id] + '44' : 'transparent'}`,
                    }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Öncelik</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {PRIORITIES.map(p => (
                    <button key={p.id} onClick={() => setPriority(p.id)} style={{
                      flex: 1, padding: '5px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                      background: priority === p.id ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                      color: priority === p.id ? p.color : 'rgba(255,255,255,0.35)',
                      fontSize: 10, fontWeight: 600, transition: 'all .15s',
                      border: `0.5px solid ${priority === p.id ? p.color + '44' : 'transparent'}`,
                    }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FILTER TABS ── */}
        <div style={{ padding: '10px 14px 6px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {[
            ...CATEGORIES,
            { id: 'done', label: 'Bitti', icon: <CheckCircle size={13} /> },
          ].map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filter === c.id ? `${accent}20` : 'rgba(255,255,255,0.04)',
              color: filter === c.id ? accent : 'rgba(255,255,255,0.35)',
              fontSize: 11, fontWeight: 600, transition: 'all .15s',
              border: `0.5px solid ${filter === c.id ? accent + '44' : 'transparent'}`,
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* ── TASK LIST ── */}
        <div className="todo-scroll" style={{ padding: '8px 12px 14px', display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 320, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '28px 0',
              color: 'rgba(255,255,255,0.2)', fontSize: 13,
            }}>
              {filter === 'done' ? '✅ Henüz tamamlanan yok' : '📝 Görev ekle, odaklan!'}
            </div>
          )}
          {filtered.map(t => (
            <div key={t.id} style={{ animation: 'slideIn .25s cubic-bezier(.16,1,.3,1)' }}>
              <TaskItem task={t} onToggle={toggleTask} onDelete={deleteTask} accent={accent} />
            </div>
          ))}
        </div>

        {/* ── FOOTER SUMMARY ── */}
        {total > 0 && (
          <div style={{
            padding: '10px 16px', borderTop: '0.5px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 14 }}>
              {PRIORITIES.map(p => {
                const count = tasks.filter(t => t.priority === p.id && !t.completed).length;
                if (!count) return null;
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Flag size={10} color={p.color} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              {total - done} bekliyor
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default TodoList;