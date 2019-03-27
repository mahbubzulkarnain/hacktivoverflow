const Answer = require('../models/answer/index');
const {ObjectId} = require('mongoose').Types;

class AnswerController {
  /**
   * CRUD
   */
  static create({params, body}, res) {
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
  };

  static read({params}, res) {
    Answer
      .findById(params.id)
      .then((prop) => {
        res
          .json(prop)
      })
      .then(() => {
        console.log(err);
        res
          .status(500)
          .json({
            message: 'Internal Server Error'
          })
      })
  }

  static update({params, body}, res) {
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
  };

  static delete({params}, res) {
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
  };

  /**
   * Vote
   */
  static async upvote({params, body}, res) {
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
  };

  static async downvote({params, body}, res) {
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
  }

  /**
   * Approve
   */
  static approve ({params}, res) {
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
  }
}

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

module.exports = AnswerController;