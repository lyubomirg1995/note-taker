const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, './db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    };
    
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), err => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

//Delete notes
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);

        // Filter out the note with the specified id
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), err => {
            if (err) throw err;
            res.json({ message: "Note deleted!" });
        });
    });
});


// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
