const router = require('express').Router();
const Question = require('../models/question/index');
const Answer = require('../models/answer/index');
const Tag = require('../models/tag/index');
const jwt = require('../middlewares/jwt');
const {ObjectId} = require('mongoose').Types;
const slugify = require('slugify');

function getQuestionBySlug(slug) {
  return Question
    .findOne({
      slug: slug
    })
    .populate('author', '-password -googleToken')
    .populate({
      path: 'answer',
      populate: {
        path: 'author',
        select: '_id first_name last_name picture email username __v'
      }
    })
    .populate('author', '-password -googleToken')
}

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
          try {
            question.answerApproved = params.id;
            question.updated_at = new Date();
            await question.save()
          } catch (e) {
            console.log(e)
          }
          res
            .json(await getQuestionBySlug(params.slug))
        }
      })
  });

async function clearVoteAnswer(id, user) {
  try {
    await Answer
      .update({_id: ObjectId(id)}, {"$pull": {"upvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }

  try {
    await Answer
      .update({_id: ObjectId(id)}, {"$pull": {"downvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }
}

/**
 * answer: { downvotes: [], upvotes: [dimitri] }
 *
 * 1. Manipulasi array di JavaScript
 * 2. Answer.update({ downvotes, upvotes });
 */

router
  .patch('/:slug/answers/:id/down', jwt, async function ({params, body}, res, next) {
    await clearVoteAnswer(params.id, res.locals.user.id);
    Answer
      .findById(params.id)
      .then(async (answer) => {
        if (!answer) {
          res
            .status(204)
            .send();
        } else {
          let newAnswer = answer;
          try {
            answer.downvote.push(res.locals.user.id);
            newAnswer = await answer.save();
          } catch (e) {
            console.log(e)
          }
          res
            .json(newAnswer)
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
  .patch('/:slug/answers/:id/up', jwt, async function ({params, body}, res, next) {
    await clearVoteAnswer(params.id, res.locals.user.id);
    Answer
      .findById(params.id)
      .then(async (answer) => {
        if (!answer) {
          res
            .status(204)
            .send();
        } else {
          let newAnswer = answer;
          try {
            answer.upvote.push(res.locals.user.id);
            newAnswer = await answer.save();
          } catch (e) {
            console.log(e)
          }
          res.json(newAnswer)
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
  .get('/:slug/answers/:id', function ({params}, res, next) {
    Answer
      .findById(params.id)
      .then((prop)=>{
        res
          .json(prop)
      })
      .then(()=>{
        console.log(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  })
  .delete('/:slug/answers/:id', jwt, function ({params}, res, next) {
    Answer
      .findById(params.id)
      .then(async (answer) => {
        if (!answer) {
          res
            .status(204)
            .send()
        } else {
          let deletedAnswer = answer;
          try {
            deletedAnswer = await answer.remove();
            await Question
              .update({slug: params.slug}, {"$pull": {"answer": answer._id}}, {
                safe: true,
                multi: true
              });
          } catch (e) {
            console.log(e)
          }
          res
            .json(deletedAnswer)
        }
      })
      .catch((err) => {
        console.error(err);
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
          try {
            delete body['author'];
            answer.updated_at = new Date();
            Object.assign(answer, body);
            await answer.save()
          } catch (e) {
            console.log(e)
          }
          res
            .json(await getQuestionBySlug(params.slug))
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
    getQuestionBySlug(params.slug)
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
          getQuestionBySlug(params.slug)
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
      .update({slug: slug}, {"$pull": {"upvote": user}}, {
        safe: true,
        multi: true
      });
  } catch (e) {
    console.log(e)
  }

  try {
    await Question
      .update({slug: slug}, {"$pull": {"downvote": user}}, {
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
    getQuestionBySlug(params.slug)
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
    getQuestionBySlug(params.slug)
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
    getQuestionBySlug(params.slug)
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
  .patch('/:slug', jwt, function ({params, body}, res) {
    delete body['_id'];
    delete body['slug'];
    delete body['author'];
    let newTag = [];
    if (body.tags && body.tags.length) {
      body.tags.forEach((tag) => {
        newTag.push(slugify(tag).toLowerCase())
      })
    }
    body.tags = newTag;
    Question
      .findOne({
        slug: params.slug
      })
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
  .delete('/:slug', jwt, function ({params}, res, next) {
    Question
      .findOne({
        slug: params.slug
      })
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
    let newTag = [];
    if (body.tags && body.tags.length) {
      body.tags.forEach((tag) => {
        newTag.push(slugify(tag).toLowerCase())
      })
    }
    body.tags = newTag;
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