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
app.post('/users/google-login', (req, res) => {
  const idToken = req.body.id_token;

  verifyToken(idToken)
    .then(payload => {
      if (payload) {
        const userId = payload.sub;
        const email = payload.email;
        const name = payload.name;

        // Simple example: Send user info back to the client
        res.json({ userId, email, name });

        // Add your user handling logic here (e.g., database interaction)
        // Check if user exists, create if not, login, create session/JWT
        // ...
      } else {
        res.status(401).json({ message: 'Invalid token' });
      }
    })
    .catch(error => {
        console.error('There has been a problem with token verification:', error);
        res.status(500).json({message: 'Server Error'})
    });
});

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.send('New API Project is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});