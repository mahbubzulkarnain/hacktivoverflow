const router = require('express').Router();
const checkAuth = require('../middlewares/validator/checkAuth');
const Auth = require('../controllers/auth');

router
  .post('/register', checkAuth.register, Auth.register)
  .post('/login', checkAuth.login, Auth.login);

module.exports = router;
