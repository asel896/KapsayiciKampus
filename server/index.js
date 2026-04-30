const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test Rotası
app.get('/test', async (req, res) => {
    res.json({ message: "Bağlantı Başarılı!" });
});

// GET - Tüm Görevleri Getir
app.get('/todos', async (req, res) => {
  try {
    // "ORDER BY id DESC" eklendi: Büyük ID'li (yeni) olanlar önce gelir
    const allTodos = await pool.query("SELECT * FROM todos ORDER BY id DESC");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu hatası");
  }
});

// POST - Yeni Görev Ekle
app.post('/todos', async (req, res) => {
    try {
        console.log("İstek geldi:", req.body); // Gelen veriyi terminalde gör
        const { text, category, priority } = req.body;
        
        const newTodo = await pool.query(
            "INSERT INTO todos (text, category, priority, completed) VALUES($1, $2, $3, $4) RETURNING *",
            [text, category, priority, false]
        );
        
        console.log("Kayıt başarılı:", newTodo.rows[0]);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error("POST HATASI DETAYI:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// PUT ve DELETE kısımlarını da eklediğinden emin ol...
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        await pool.query("UPDATE todos SET completed = $1 WHERE id = $2", [completed, id]);
        res.json("Güncellendi");
    } catch (err) { console.error(err.message); }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todos WHERE id = $1", [id]);
        res.json("Silindi");
    } catch (err) { console.error(err.message); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor`));