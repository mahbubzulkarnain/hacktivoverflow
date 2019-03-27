const router = require('express').Router();
const jwt = require('../middlewares/jwt');

const Answer = require('../controllers/answer');
const Question = require('../controllers/question');

router
  .patch('/:slug/answers/:id/approve', jwt, Answer.approve);

router
  .patch('/:slug/answers/:id/down', jwt, Answer.downvote)
  .patch('/:slug/answers/:id/up', jwt, Answer.upvote)
  .get('/:slug/answers/:id', Answer.read)
  .delete('/:slug/answers/:id', jwt, Answer.delete)
  .patch('/:slug/answers/:id', jwt, Answer.update)
  .post('/:slug/answers', jwt, Answer.create)
  .get('/:slug/answers', Question.read);

router
  .patch('/:slug/up', jwt, Question.upvote)
  .patch('/:slug/down', jwt, Question.downvote);

router
  .get('/:slug', Question.read)
  .patch('/:slug', jwt, Question.update)
  .delete('/:slug', jwt, Question.list);

router
  .get('/', Question.list)
  .post('/', jwt, Question.create);

module.exports = router;
