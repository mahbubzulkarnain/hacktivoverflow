const User = require('../models/user/index');
const slugify = require('slugify');

class UserController {
  static read(req, res) {
    User
      .findById(res.locals.user.id, '-password')
      .then((prop) => {
        res
          .json(prop)
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

  static updateWatchedTag({body}, res, next) {
    User
      .findById(res.locals.user.id)
      .then(async (user) => {
        if (!user) {
          res
            .status(204)
            .send()
        } else {
          let newTag = [];
          if (body.tags && body.tags.length) {
            body.tags.forEach((tag) => {
              newTag.push(slugify(tag).toLowerCase())
            })
          }
          body.tags = newTag;
          user.watched = body.tags;
          await user.save();
          delete user['password'];
          res
            .json(user)
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
}

module.exports = UserController;