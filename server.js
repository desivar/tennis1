const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Register routes
app.use('/items', itemsRoutes);
app.use('/users', usersRoutes);

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Add Google Sign-In route
app.post('/users/google-login', async (req, res) => {
  const idToken = req.body.id_token;

  try {
    const payload = await verifyToken(idToken);
    if (payload) {
      const userId = payload.sub;
      const email = payload.email;
      const name = payload.name;

      // --- User Handling Logic (Replace with your database logic) ---

      // Example: Simple in-memory user storage (replace with database)
      let user = await mongoose.model('User').findOne({ googleId: userId });

      if (!user) {
        // Create a new user
        const newUser = new mongoose.model('User')({
          googleId: userId,
          email: email,
          name: name,
        });
        user = await newUser.save();
      }

      // Example: Create a simple session (replace with JWT or proper session management)
      res.json({ message: 'Login successful', user: { userId, email, name } });

      // --- End User Handling Logic ---

    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('There has been a problem with token verification or user handling:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.send('New API Project is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
