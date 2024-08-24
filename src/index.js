const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_DIR = path.join(__dirname, 'files');

// Ensure the files directory exists
if (!fs.existsSync(FILE_DIR)) {
    fs.mkdirSync(FILE_DIR);
}

// Middleware to parse JSON bodies
app.use(express.json());

// set home page
app.get('/', (req, res) => {
    try {
        res.send(`
            <h1><center>Welcome, use the following paths to do actions</center></h1>
            <p><a href="/create-file">/create-file</a> used to create a file with current date and time content in it.</p>
            <p><a href="/read-files">/read-files</a> used to read all the files from the specified folder.</p>
            <p><a href="/current-datetime">/current-datetime</a> used to get current date time.</p>
            `)
    } catch (error) {
        res.status(500).send("Internal Server error");
    }
})

// API endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const fileName = `${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const filePath = path.join(FILE_DIR, fileName);
    const fileContent = new Date().toISOString();

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create file' });
        }
        res.status(201).json({ message: 'File created successfully' });
    });
});

// API endpoint to create a text file with the current timestamp
// as I connected with instructor post will work in postman and applicaiton not direct in web so I used get request for web show.
app.get('/create-file', (req, res) => {
    const fileName = `${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const filePath = path.join(FILE_DIR, fileName);
    const fileContent = new Date().toISOString();

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create file' });
        }
        res.status(201).json({ message: 'File created successfully' });
    });
});

// API endpoint to read the content of the text file
app.get('/read-files', (req, res) => {
    fs.readdir(FILE_DIR, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files');
        }

        const fileContents = [];
        let filesRead = 0;

        files.forEach((file) => {
            const filePath = path.join(FILE_DIR, file);
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    return res.status(500).send('Error reading file content');
                }

                fileContents.push({ fileName: file, content });
                filesRead++;

                if (filesRead === files.length) {
                    res.json(fileContents);
                }
            });
        });
    });
});

// to get current date time.
app.get('/current-datetime', (req, res) => {
    try {
        res.send(new Date().toISOString());
    } catch (error) {
        res.status(500).send('Error getting current date and time');
    }
})


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});