const router = require('express').Router();
const Question = require('../controllers/question');
const jwt = require('../middlewares/jwt');

router
  .get('/', jwt, Question.watched);

module.exports= router;