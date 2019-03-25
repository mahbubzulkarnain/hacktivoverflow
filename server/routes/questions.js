const router = require('express').Router();
const Question = require('../models/question/index');
const Answer = require('../models/answer/index');
const jwt = require('../middlewares/jwt');

router
  .patch('/:slug/answers/:id/approve', jwt, function ({params}, res, next) {
    Question
      .findOne({
        slug: params.slug,
        author: res.locals.user.id
      })
      .populate('answer')
      .populate('author', '-password')
      .then(async (question) => {
        if (!question) {
          res
            .status(204)
            .send();
        } else {
          question.answerApproved = params.id;
          res
            .json(await question.save())
        }
      })
  });

async function clearVoteAnswer(id, user) {
  try {
    await Answer
      .updateOne({_id: id}, {"$pull": {"upvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }

  try {
    await Question
      .updateOne({slug: slug}, {"$pull": {"downvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }
}

router
  .patch('/:slug/answers/:id/down', jwt, function ({params, body}, res, next) {
    clearVoteAnswer(params.id, res.locals.user.id);
    Answer
      .findById(params.id)
      .then(async (answer) => {
        if (!answer) {
          res
            .status(204)
            .send();
        } else {
          answer.downvote.push(res.locals.user.id);
          res
            .json(await answer.save())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  })
  .patch('/:slug/answers/:id/up', jwt, function ({params, body}, res, next) {
    clearVoteAnswer(params.id, res.locals.user.id);
    Answer
      .findById(params.id)
      .then(async (answer) => {
        if (!answer) {
          res
            .status(204)
            .send();
        } else {
          answer.upvote.push(res.locals.user.id);
          res
            .json(await answer.save())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  })
  .patch('/:slug/answers/:id', jwt, function ({params, body}, res, next) {
    Answer
      .findById(params.id)
      .then(async (answer) => {
        if (!answer) {
          res
            .status(204)
            .send();
        } else {
          delete body['author'];
          answer.updated_at = new Date();
          Object.assign(answer, body);
          res
            .json(await answer.save())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  })
  .get('/:slug/answers', function ({params}, res, next) {
    Question
      .findOne({
        slug: params.slug
      })
      .populate('answer')
      .populate('author', '-password')
      .then((props) => {
        res
          .json(props)
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  })
  .post('/:slug/answers', jwt, function ({params, body}, res, next) {
    body['author'] = res.locals.user.id;
    (new Answer(body))
      .save((err, saveAnswer) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .json({
              message: 'Internal Server Error'
            })
        } else {
          Question
            .findOne({
              slug: params.slug
            })
            .then(async (question) => {
              try {
                question.answer.push(saveAnswer._id);
                await question.save();
              } catch (e) {

              }
              res
                .status(201)
                .json(saveAnswer)
            })
            .catch((err) => {
              res
                .status(500)
                .json({
                  message: 'Internal Server Error'
                })
            });
        }
      })
  });

async function clearVoteQuestion(slug, user) {
  try {
    await Question
      .updateOne({slug: slug}, {"$pull": {"upvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }

  try {
    await Question
      .updateOne({slug: slug}, {"$pull": {"downvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }
}

router
  .patch('/:slug/up', jwt, async function ({params}, res, next) {
    await clearVoteQuestion(params.slug, res.locals.user.id);
    Question
      .findOne({
        slug: params.slug
      })
      .then(async (question) => {
        if (!question) {
          res
            .status(204)
            .send();
        } else {
          question.upvote.push(res.locals.user.id);
          res
            .json(await question.save())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json(`Internal Server Error`)
      })
  })
  .patch('/:slug/down', jwt, async function ({params}, res, next) {
    await clearVoteQuestion(params.slug, res.locals.user.id);
    Question
      .findOne({
        slug: params.slug
      })
      .then(async (question) => {
        if (!question) {
          res
            .status(204)
            .send();
        } else {
          question.downvote.push(res.locals.user.id);
          res
            .json(await question.save())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json(`Internal Server Error`)
      })
  });

router
  .get('/:slug', function ({params}, res, next) {
    Question
      .findOne({
        slug: params.slug
      })
      .populate('answer')
      .populate('author', '-password')
      .then((props) => {
        res
          .json(props)
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json(`Internal Server Error`)
      })
  })
  .patch('/:id', jwt, function ({params, body}, res) {
    delete body['id'];
    delete body['author'];
    Question
      .findById(params.id)
      .then(async (question) => {
        if (!question) {
          res
            .status(204)
            .send()
        } else {
          question.updated_at = new Date();
          Object.assign(question, body);
          res
            .json(await question.save())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json(`Internal Server Error`)
      })
  })
  .delete('/:id', jwt, function ({params}, res, next) {
    Question
      .findById(params.id)
      .then(async (question) => {
        if (!question) {
          res
            .status(204)
            .send()
        } else {
          res
            .json(await question.remove())
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json(`Internal Server Error`)
      })
  });

router
  .get('/', function (req, res, next) {
    Question
      .find()
      .populate('answer')
      .populate('author', '-password')
      .then((props) => {
        res
          .json(props)
      })
      .catch((err) => {
        res
          .status(500)
          .json(err)
      })

  })
  .post('/', jwt, function ({body}, res) {
    body['author'] = res.locals.user.id;
    (new Question(body))
      .save((err, data) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .json({
              message: 'Internal Server Error'
            })
        } else {
          res
            .status(201)
            .json(data)
        }
      })
  });

module.exports = router;