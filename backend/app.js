const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const indexRouter = require('./routes/index');
const memberRouter = require('./routes/member.routes');
const dailyLoginRewardsRouter = require('./routes/dailyLoginRewards.routes');
const levelRouter = require('./routes/level.routes');
const boosterRouter = require('./routes/booster.routes');
const adminRouter = require('./routes/admin.routes');
const telegramRoutes = require('./routes/telegram.routes');
const taskRoutes = require('./routes/tasks.routes');
const apiKeyMiddleware = require('./middlewares/apiKey.middleware');
const { setTelegramWebhook } = require('./controllers/telegram.controller');

const app = express();

// Define the whitelist for CORS
const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://atrnoarenaapi.aeternus.foundation',
  'https://atrnoarena.aeternus.foundation',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '25kb' }));

app.use(express.json());

// Configure CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware for serving static files
app.use(express.static('public'));

// HTTP request logger
app.use(logger('dev'));



// Integrate API key middleware on API routes
app.use('/api/v1', apiKeyMiddleware);

// Define all routes
app.use('/', indexRouter);
app.use('/api/v1/member', memberRouter);
app.use('/api/v1/daily-login-reward', dailyLoginRewardsRouter);
app.use('/api/v1/level', levelRouter);
app.use('/api/v1/booster', boosterRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/telegram', telegramRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
