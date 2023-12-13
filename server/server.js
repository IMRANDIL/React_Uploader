// file-uploader-backend/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors')
const app = express();
const port = 5000;

// Setup Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file was uploaded.');
    }

    const uploadedFile = req.file;
    const uploadDir = path.join(__dirname, 'uploads');

    // Create the 'uploads' directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uploadedFile.originalname);

    // Write the buffer to the file
    fs.writeFileSync(filePath, uploadedFile.buffer);

    console.log('File saved:', filePath);
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
