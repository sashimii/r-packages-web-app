const mongoose = require('mongoose');
require('dotenv').config();


module.exports = (mongoUri) => {
  mongoose.connect(mongoUri, {useNewUrlParser: true});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    // we're connected!
    console.log('Connected to Database');
  });
};