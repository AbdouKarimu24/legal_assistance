const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user (mock implementation)
    const user = {
      id: Date.now(),
      email,
      name,
      password: hashedPassword
    };

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mock user validation
    const isValid = true; // Replace with actual validation

    if (isValid) {
      const token = jwt.sign({ userId: 1, email }, 'secret-key', { expiresIn: '24h' });
      res.json({ token, user: { id: 1, email, name: 'Test User' } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app;