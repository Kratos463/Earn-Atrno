const express = require('express');
const { initiateOAuth, handleOAuthCallback, checkFollowStatus } = require('../controllers/twitter.controller');
const router = express.Router();

// Route to initiate Twitter OAuth process
router.get('/', initiateOAuth);

// Route to handle OAuth callback and get user details
router.get('/callback', handleOAuthCallback);

// Route to check if the user follows the specified Twitter account
router.get('/check-follow', checkFollowStatus);

module.exports = router;
