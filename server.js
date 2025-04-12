const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser'); // Add this line

const itemsRoutes = require('./routes/items');
const usersRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 5500;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Use express.json() to parse incoming JSON requests
app.use(express.json());
app.use(bodyParser.json()); // Add this line

// Enable CORS
app.use(cors());

// Register routes
app.use('/items', itemsRoutes);
app.use('/users', usersRoutes);

// Add Google Sign-In route
app.post('/users/google-login', (req, res) => {
  const idToken = req.body.id_token;

  // Verify the idToken using Google's client libraries
  // ... (Your server-side verification code here) ...

  // If the token is valid, extract user information
  // ...

  // Create or log in the user in your database
  // ...

  // Create a session or JWT for your application
  // ...

  // Send a response to the client
  res.json({ message: 'Google login successful' }); // Or send user data
});

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.send('New API Project is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});