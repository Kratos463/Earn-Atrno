var express = require('express');
const {
    registerOrLoginMember,
    checkWallet,
    claimCurrentDayLoginReward,
    fetchMember,
    fetchFriendList
} = require('../controllers/member.controller');
const VerifyMember = require('../middlewares/verifyMember.middleware');
const { tapCoin } = require('../controllers/taponcoin.controller');
var router = express.Router();


router.route("/register-member").post(registerOrLoginMember)
router.route("/check-wallet").get(checkWallet)
router.route("/claim-current-day-login-reward").post(VerifyMember, claimCurrentDayLoginReward)
router.route("/get-member").get(VerifyMember, fetchMember)
router.route("/friend-list").get(VerifyMember, fetchFriendList)

router.route("/tap-on-coin").post(VerifyMember, tapCoin)

module.exports = router;
