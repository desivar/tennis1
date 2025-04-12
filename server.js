const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const itemsRoutes = require('./routes/items');
const usersRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 5500;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

app.use('/items', itemsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('New API Project is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});