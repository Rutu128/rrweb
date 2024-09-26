const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive form data and styles
app.post('/save-recording', (req, res) => {
  const { formData } = req.body;

  // Save the form data to a file or handle it as needed
  const filePath = path.join(__dirname, 'form-data.json');
  fs.writeFile(filePath, JSON.stringify(formData, null, 2), (err) => {
    if (err) {
      console.error('Error saving the form data:', err);
      res.status(500).json({ message: 'Failed to save form data.' });
    } else {
      console.log('Form data saved successfully.');
      res.status(200).json({ message: 'Form data saved successfully.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
