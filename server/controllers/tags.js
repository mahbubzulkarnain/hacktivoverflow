const Question = require('../models/question/index');

class TagController {
  static read({params}, res, next) {
    Question
      .find({
        tags: params.tags
      })
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
  }
}

module.exports = TagController;