const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
});

module.exports = mongoose.model('tags', tagSchema);