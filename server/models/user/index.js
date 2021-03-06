const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: null
  },
  last_name: {
    type: String,
    default: null
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: null
  },
  googleToken: {
    type: String,
    default: null
  },
  watched: [{
    type: String,
  }],
  password: {
    type: String,
    required: true
  },
});

userSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('users', userSchema);