const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Secret API key for protecting POST endpoint
const SECRET_API_KEY = 'my-secret-token';

const dataFile = path.join(__dirname, 'feedback.json');

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use(express.json());

// Ensure feedback.json exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, '[]');
}

// Load feedback list from file
function loadFeedback() {
  try {
    const rawData = fs.readFileSync(dataFile);
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading feedback.json:', err);
    return [];
  }
}

// Save feedback list to file
function saveFeedback(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to feedback.json:', err);
  }
}

// GET all feedback
app.get('/api/feedback', (req, res) => {
  const feedbackList = loadFeedback();
  res.json(feedbackList);
});

// POST new feedback (protected)
app.post('/api/feedback', (req, res) => {
  console.log('Received headers:', req.headers);
  console.log('Received body:', req.body);
  
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== SECRET_API_KEY) {
    console.log('Invalid API key received:', apiKey);
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }

  const { name, department, rating, feedback } = req.body;

  if (!name || !department || !rating || !feedback) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const feedbackList = loadFeedback();
  feedbackList.unshift({
    name,
    department,
    rating: parseFloat(rating),
    feedback,
    timestamp: new Date().toISOString()
  });

  saveFeedback(feedbackList);
  res.status(200).json({ message: 'Feedback saved successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});