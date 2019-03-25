const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: (require('../user/index')).collection.name
  },
  upvote: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../user/index')).collection.name
  }],
  downvote: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../user/index')).collection.name
  }],
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('answers', answerSchema);