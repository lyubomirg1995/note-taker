//Required dependencies and modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); //Generates unique ID for notes
//Express app setup
const app = express();
const PORT = process.env.PORT || 3000; //PORT for Heroku deployment or local use
const dbPath = path.join(__dirname, './db/db.json');
//Middleware to handle data parsing and public directory access
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); //Serves the frontend files from the public directory

// API Routes to fetch all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});
//API Route to create a new note
app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4() //Assign a unique ID to each new note
    };
    
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        //Write the new note to the JSON database
        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), err => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

//API Route to delete a note by its ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);

        // Filter out the note with the specified id
        notes = notes.filter(note => note.id !== noteId);
        //Update the JSON database after deletion
        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), err => {
            if (err) throw err;
            res.json({ message: "Note deleted!" });
        });
    });
});


// HTML route to serve the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
//Default HTML route to serve the homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


//Server listening setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
