const router = require('express').Router();
const Tag = require('../controllers/tags');
const User = require('../controllers/user');
const jwt = require('../middlewares/jwt');


router
  .post('/watched', jwt, User.updateWatchedTag)
  .get('/:tags', Tag.read);

module.exports = router;