const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  upvote: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../user/index')).collection.name
  }],
  downvote: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../user/index')).collection.name
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: (require('../user/index')).collection.name
  },
  answerApproved: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  answer: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../answer/index')).collection.name
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../tag/index')).collection.name
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

questionSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('questions', questionSchema);