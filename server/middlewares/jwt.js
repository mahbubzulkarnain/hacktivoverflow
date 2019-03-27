const jwt = require('../helpers/jwt');
const User = require('../models/user/index');

module.exports = async function (req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
    try {
      let decode = jwt.verify(token.replace('Bearer ', ''));
      if (decode && decode.id) {
        let user = await User.findById(decode.id).exec();
        if (user) {
          res.locals.user = {
            id: user.id,
            watched: user.watched
          };
          return next()
        }else{
          res
            .status(401)
            .json({
              message: "Unauthorized"
            })
        }
      }
    } catch (e) {
      console.log(e)
    }
  } else {
    res
      .status(401)
      .json({
        message: "Unauthorized"
      })
  }
};