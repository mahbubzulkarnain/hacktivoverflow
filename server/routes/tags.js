const router = require('express').Router();
const Question = require('../models/question/index');

router
  .get('/:tags',function ({params}, res, next) {
    Question
      .find({
        tags: params.tags
      })
      .then((props)=>{
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
  });

module.exports = router;