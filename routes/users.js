const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Validation middleware
const validateUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// GET all users (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users.' });
  }
});

// GET one user by ID (protected)
router.get('/:id', authenticateToken, getUser, (req, res) => {
  res.json(res.user);
});

// GET user profile (protected)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile.' });
  }
});

// POST a new user (registration)
router.post('/', validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Error registering user.' });
  }
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// PATCH (update) a user by ID (protected)
router.patch('/:id', authenticateToken, getUser, async (req, res) => {
  if (req.body.password) {
    res.user.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.username) {
    res.user.username = req.body.username;
  }
  if (req.body.email) {
    res.user.email = req.body.email;
  }
  // Add other fields you might want to update here.

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user.' });
  }
});

// DELETE a user by ID (protected)
router.delete('/:id', authenticateToken, getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

// Middleware to get a user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id).select('-password');
    if (user == null) {
      return res.status(404).json({ message: 'User not found.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving user.' });
  }

  res.user = user;
  next();
}

module.exports = router;