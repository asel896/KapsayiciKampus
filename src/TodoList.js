import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', marginBottom: '20px' }}>
      <h4 style={{ color: '#a855f7', marginBottom: '15px' }}>🎯 Odak Hedefleri</h4>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Görev ekle..."
          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
        />
        <button onClick={addTask} style={{ background: '#a855f7', border: 'none', borderRadius: '10px', padding: '10px', color: 'white', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', opacity: t.completed ? 0.5 : 1 }}>
            <CheckCircle size={18} cursor="pointer" onClick={() => setTasks(tasks.map(task => task.id === t.id ? {...task, completed: !task.completed} : task))} />
            <span style={{ flex: 1 }}>{t.text}</span>
            <Trash2 size={16} cursor="pointer" onClick={() => setTasks(tasks.filter(task => task.id !== t.id))} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;