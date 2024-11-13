
const express = require('express');
const { handleWebhooks } = require('../controllers/telegram.controller');
const router = express.Router();

// Route for receiving updates from Telegram
router.route('/webhook').post(handleWebhooks);

module.exports = router;
