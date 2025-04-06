const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const app = express();
const port = 3010;

// Middleware
app.use(bodyParser.json());
app.use(express.static('static'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/socialmedia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'pages/index.html'));
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
