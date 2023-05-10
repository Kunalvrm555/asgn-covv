const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });

    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
