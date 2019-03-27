const router = require('express').Router();
const User = require('../controllers/user');
const jwt = require('../middlewares/jwt');

router.get('/', jwt, User.read);

module.exports = router;
