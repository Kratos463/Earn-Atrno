var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member.routes');
var dailyLoginRewardsRouter = require('./routes/dailyLoginRewards.routes');
var levelRouter = require('./routes/level.routes');
var boosterRouter = require('./routes/booster.routes');
const apiKeyMiddleware = require('./middlewares/apiKey.middleware');

var app = express();

// Define the whitelist for CORS
var whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
]

var corsOptions = {
  origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true
};


app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '25kb' }));

// Configure CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware for serving static files
app.use(express.static('public'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//intrigate middlewar on api 
app.use('/api/v1', apiKeyMiddleware)

app.use('/', indexRouter);
app.use('/api/v1/member', memberRouter);
app.use('/api/v1/daily-login', dailyLoginRewardsRouter);
app.use('/api/v1/level', levelRouter);
app.use('/api/v1/booster', boosterRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({ error: 'Not Found' });
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
