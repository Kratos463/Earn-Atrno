const Twitter = require('twitter-lite');

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const getUserFollowers = async (screen_name) => {
  try {
    const response = await client.get('followers/list', { screen_name, count: 200 });
    return response.users;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

module.exports = { getUserFollowers };
