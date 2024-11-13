#!/usr/bin/env node

require('dotenv').config();
const connectDB = require('./database/connectdb');
const app = require('./app');
const debug = require('debug')('backend:server');
const http = require('http');
const redisClient = require("./utils/redisConnect.js")
const { setTelegramWebhook } = require('./controllers/telegram.controller');
const { scheduleTasks } = require('./services/schedule.js');

/**
 * Connect to the Database
 */
connectDB();

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '9001');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // named pipe
  }

  if (port >= 0) {
    return port; // port number
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log(`----------> Server running on port ${port}`);
  debug('Listening on ' + bind);
  // setTelegramWebhook()
  // .then(() => {
  //     console.log(`Webhook set successfully.`);
  // })
  // .catch((error) => {
  //     console.error('Error setting webhook:', error);
  // });
  scheduleTasks();
}

/**
 * Graceful shutdown
 */
function shutdown() {
  console.log('Shutting down server...');

  server.close(() => {
    console.log('HTTP server closed.');

    redisClient.quit()
      .then(() => {
        console.log('Redis client disconnected.');
        process.exit(0);
      })
      .catch(err => {
        console.error('Error disconnecting Redis client:', err);
        process.exit(1);
      });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
