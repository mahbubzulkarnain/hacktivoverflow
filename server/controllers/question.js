const Question = require('../models/question/index');
const slugify = require('slugify');

class QuestionController {
  /**
   * CRUD
   */
  static create({body}, res) {
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
  };

  static list(req, res, next) {
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

  };

  static read({params}, res, next) {
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
  };

  static update({params, body}, res) {
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
  };

  static delete({params}, res, next) {
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
  };

  /**
   * Vote
   */
  static async upvote({params}, res, next) {
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
  };

  static async downvote({params}, res, next) {
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
  };

  /**
   * Filter By Watched User Login
   */
  static watched(req, res, next) {
    Question
      .find({tags:{$in: res.locals.user.watched}})
      .populate('author', '-password -googleToken')
      .populate({
        path: 'answer',
        populate: {
          path: 'author',
          select: '_id first_name last_name picture email username __v'
        }
      })
      .then((props) => {
        res
          .json(props)
      })
      .catch((err) => {
        res
          .status(500)
          .json(err)
      })
  }
}

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
}

module.exports = QuestionController;