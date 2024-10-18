const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8001;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>File Upload and Download</h1>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file">
          <input type="submit" value="Upload">
        </form>
        <br>
        <form action="/files" method="get">
          <input type="submit" value="List Files">
        </form>
      </body>
    </html>
  `);
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully. <a href="/files/${req.file.filename}">Download ${req.file.filename}</a>`);
});

// List all files
app.get('/files', (req, res) => {
  const uploadDir = 'uploads';
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }
    let fileList = '<h2>Uploaded Files:</h2><ul>';
    files.forEach(file => {
      fileList += `<li><a href="/files/${file}">${file}</a></li>`;
    });
    fileList += '</ul>';
    res.send(fileList);
  });
});

// Serve a specific file
app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.download(filepath, filename, (err) => {
      if (err) {
        res.status(500).send('Error downloading file');
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
