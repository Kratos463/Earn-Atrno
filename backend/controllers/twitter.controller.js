const { OAuth } = require('oauth');
const Twitter = require('twitter-lite');
const dotenv = require('dotenv');
dotenv.config();

const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || 'http://localhost:9000/auth/twitter/callback';

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET,
  '1.0A',
  CALLBACK_URL,
  'HMAC-SHA1'
);

// Twitter client setup with default app access
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
  version: "2",
  extension: false,
});

// Controller for initiating Twitter OAuth process
const initiateOAuth = (req, res) => {
  console.log('Initiating Twitter OAuth process...');

  oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
    if (error) {
      console.error('Error obtaining OAuth request token:', error);
      return res.status(500).json({ error: 'Failed to initiate Twitter authentication' });
    }

    // Store the OAuth token and secret in the session
    req.session.oauthToken = oauthToken;
    req.session.oauthTokenSecret = oauthTokenSecret;

    // Redirect the user to Twitter for authentication
    console.log(`Redirecting to Twitter for authentication with oauthToken: ${oauthToken}`);
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`);
  });
};

// Controller for handling OAuth callback and getting user details
const handleOAuthCallback = async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  const { oauthToken, oauthTokenSecret } = req.session;

  if (oauth_token !== oauthToken) {
    console.warn('OAuth tokens do not match or session expired');
    return res.status(400).json({ error: 'OAuth tokens do not match or session expired' });
  }

  oauth.getOAuthAccessToken(
    oauth_token,
    oauthTokenSecret,
    oauth_verifier,
    async (error, accessToken, accessTokenSecret) => {
      if (error) {
        console.error('Error obtaining OAuth access token:', error);
        return res.status(500).json({ error: 'Failed to obtain Twitter access token' });
      }

      try {
        // Use the access token and secret to authenticate with the Twitter API
        const userClient = new Twitter({
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          access_token_key: accessToken,
          access_token_secret: accessTokenSecret,
        });

        // Get user details
        const userDetails = await userClient.get('account/verify_credentials', {});
        console.log('User details retrieved:', userDetails);

        // Store user details in session
        req.session.twitterUserId = userDetails.id_str;

        const officialTwitterPage = "https://x.com/DaveReynol24897"

        // Redirect to frontend with user details in query parameters
        res.redirect(officialTwitterPage);
      } catch (err) {
        console.error('Twitter API Error while retrieving user details:', err);
        res.status(500).json({ error: 'Failed to retrieve user details' });
      }
    }
  );
};

// Controller for checking if the user follows the specified account
const checkFollowStatus = async (req, res) => {
  const { platform } = req.query;
  const userId = req.session.twitterUserId;

  if (!userId) {
    console.warn('User not authenticated with Twitter');
    return res.status(401).json({ error: 'User not authenticated with Twitter' });
  }

  if (platform === 'twitter') {
    try {
      // Check if the user follows the specified Twitter account
      const result = await twitterClient.get('friendships/show', {
        source_id: userId,
        target_id: process.env.TARGET_TWITTER_ID, // Set the target Twitter ID in .env
      });

      console.log('Follow status result:', result);
      if (result.relationship.source.following) {
        return res.json({ followed: true });
      } else {
        return res.json({ followed: false });
      }
    } catch (error) {
      console.error('Twitter API Error while checking follow status:', error);
      return res.status(500).json({ error: 'Failed to check follow status' });
    }
  } else {
    console.warn('Invalid platform specified');
    return res.status(400).json({ error: 'Invalid platform specified' });
  }
};

module.exports = {
  initiateOAuth,
  handleOAuthCallback,
  checkFollowStatus,
};
