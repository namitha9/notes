const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nami',
    password: "12345678",
    database: 'notes',
});

connection.connect(function(err){
    if (err) {
        console.log("error occurred while connecting");
        console.error(err);
    } else {
        console.log("connection created with mysql successfully");
    }
});

app.get('/', (req, res) => {
    res.send("Hello! Welcome to node.js");
});

app.get('/notes', (req, res) => {
    connection.query('SELECT * FROM notes', (err, results) => {
      if (err) {
        console.error('Error fetching notes:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      console.log('Notes fetched:', results);
      res.json(results); 
    });
});

app.post('/notes', (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const query = 'INSERT INTO notes (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())';
    const values = [userId, title, content];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting note:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        return res.status(201).json({ message: 'Note added successfully', noteId: results.insertId });
    });
});

const port = 5080;

app.listen(port, () => {
    console.log(`Node js server is running on port ${port}`);
});