const redis = require('redis');
require('dotenv').config();


const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

(async () => {
    try {
        await redisClient.connect();
        console.log('----------> Connected to Redis');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redisClient