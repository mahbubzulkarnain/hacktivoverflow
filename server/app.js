if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

require('mongoose')
  .connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then((prop) => {
    console.log(`${process.env.DATABASE_URL} => ${prop.connection.name} connected, port ${prop.connection.port}.`)
  })
  .catch((err) => {
    console.error(err)
  });

app.use(require('cors')());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middlewares/customValidator'));

app
  .use('/auth', require('./routes/auth'))
  .use('/questions', require('./routes/questions'))
  .use('/tags', require('./routes/tags'))
  .use('/users', require('./routes/users'))
  .use('/watched', require('./routes/watched'));

module.exports = app;
