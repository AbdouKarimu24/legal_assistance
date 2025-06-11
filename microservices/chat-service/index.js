const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Mock chat response
    const response = {
      id: Date.now(),
      message: `Echo: ${message}`,
      timestamp: new Date().toISOString(),
      userId
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

app.get('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Mock chat history
    const history = [
      {
        id: 1,
        message: 'Hello',
        response: 'Hi there!',
        timestamp: new Date().toISOString(),
        userId
      }
    ];

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});

module.exports = app;