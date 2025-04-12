const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// Enable CORS
app.use(cors());

// Register routes
app.use('/items', itemsRoutes);
app.use('/users', usersRoutes);

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.send('New API Project is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
