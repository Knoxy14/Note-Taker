const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const express = require('express');
const uniqid = require('uniqid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/notes.html"));
})

app.get('api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db.json'));
});

app.post('api/notes', (req, res) => {
    req.body.id = uniqid();
    const newNote = req.body;
    
    fs.readFile(path.join(__dirname + '/db.json'), (err, data) => {
        let savedNotes;
        try {
            savedNotes = JSON.parse(data);
        } catch {
            savedNotes = [];
        }
        savedNotes.push(newNote);
        writeDatabase(savedNotes);
        console.log(`Added note with id ${req.body.id}`);
        res.send(`Added note with id ${req.body.id}`);
    });
});

app.delete('api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname + '/db.json'), (err, data) => {
        const savedNotes = JSON.parse(data);
        const newNotes = savedNotes.filter(item => {
            return item.id !== req.params.id;
        });
        writeDatabase(newNotes);
        console.log(`${req.params.id} deleted`)
        res.send(`Note ${req.params.id} deleted`);
    });

});

function writeDatabase(data) {
    fs.writeFile(__dirname + '/db.json', JSON.stringify(data), err => {
        if (err) throw err;
    });
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});