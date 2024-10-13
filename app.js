import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';  // Use ES Module import

const app = express();
// const mongoUri = 'mongodb://127.0.0.1:27017';
//above will not work, but below is how to grab host ip address from inside a container.
const mongoUri = 'mongodb://mymongo:27017'
const client = new MongoClient(mongoUri);

// Create a folder to store the files if it doesn't exist
const filesDir = path.resolve('files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Middleware to serve static files from 'public' folder and parse form data
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submission and save the body text as a file
app.post('/save', (req, res) => {
    const { subject, body } = req.body;
    const filePath = path.join(filesDir, `${subject}.txt`);

    // Write the content of 'body' to the file named after 'subject'
    fs.writeFile(filePath, body, (err) => {
        if (err) {
            return res.status(500).send("Failed to save file");
        }
        res.send("File saved successfully");
    });
});

// Route to list all saved files
app.get('/files', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to list files");
        }

        let fileList = '<h1>List of Saved Files</h1><ul>';
        files.forEach(file => {
            fileList += `<li>${file}</li>`;
        });
        fileList += '</ul><a href="/">Back to Home</a>';
        res.send(fileList);
    });
});

// Route to fetch a movie from the MongoDB database
app.get('/fetch-movie', async (req, res) => {
    const title = req.query.title;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        await client.connect();
        const db = client.db('mflix');
        const collection = db.collection('movies');
        const movie = await collection.findOne({ title: title });

        if (movie) {
            res.json({ description: movie.plot || 'No description available' });
        } else {
            res.json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch movie from MongoDB' });
    } finally {
        await client.close();
    }
});

// New route to fetch Star Wars character data from SWAPI
app.get('/fetch-web', async (req, res) => {
    const subject = req.query.subject;

    if (!subject || isNaN(subject)) {
        return res.status(400).json({ error: 'Please provide a valid number as the subject.' });
    }

    const swapiUrl = `https://swapi.dev/api/people/${subject}`;

    try {
        const response = await fetch(swapiUrl);
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch data from SWAPI.' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from SWAPI:', error);
        res.status(500).json({ error: 'Error fetching data from SWAPI.' });
    }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`app listening on port ${process.env.PORT || 3000}`);
});
