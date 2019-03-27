const User = require('../models/user/index');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

class AuthController {
  static login ({body}, res) {
    User
      .findOne({
        $or: [
          {username: body.user},
          {email: body.user},
        ]
      })
      .then((prop) => {
        console.log(prop, bcrypt.compareSync(body.password, prop.password), body.password);
        if (prop && bcrypt.compareSync(body.password, prop.password)) {
          res
            .status(200)
            .json({
              id: prop._id,
              username: prop.username,
              email: prop.email,
              fullname: prop.first_name + ' ' + prop.last_name,
              token: jwt.sign({
                id: prop._id
              })
            })
        } else {
          res
            .status(400)
            .json({
              message: 'Username/Email/Password Invalid'
            })
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({
            message: `Internal Server Error`
          })
      })
  }
  static register ({body}, res, next) {
    (new User(body))
      .save((err, prop) => {
        if (err) {
          res
            .status(422)
            .json({
              message: err
            })
        } else {
          res
            .status(201)
            .json({
              id: prop._id,
              username: prop.username,
              email: prop.email,
              fullname: prop.first_name + ' ' + prop.last_name,
              token: jwt.sign({
                id: prop._id
              })
            })
        }
      })
  }
}

module.exports = AuthController;