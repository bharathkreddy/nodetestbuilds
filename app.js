// /app.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Create a folder to store the files if it doesn't exist
const filesDir = path.join(__dirname, 'files');
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

// Start the server
app.listen(3000, () => {
    console.log("app listening on port 3000");
});
