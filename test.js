const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected for test');
    const newUser = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedpassword',
    });
    
    newUser.save()
      .then(user => console.log('User saved:', user))
      .catch(err => console.error('Error saving user:', err));
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB for test', err);
  });
