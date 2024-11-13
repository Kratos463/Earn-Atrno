const express = require('express');
const { tapCoin } = require('../controllers/taponcoin.controller');
const {
    claimCurrentDayLoginReward,
    fetchMember,
    fetchFriendList,
    fetchMembers
} = require('../controllers/member.controller');
const VerifyMember = require('../middlewares/verifyMember.middleware');
const router = express.Router();


router.route("/").get(fetchMembers)
router.route("/rewards/claim/daily").post(VerifyMember, claimCurrentDayLoginReward);
router.route("/current").get(VerifyMember, fetchMember);
router.route("/friends").get(VerifyMember, fetchFriendList);
router.route("/coins/tap").post(VerifyMember, tapCoin);

module.exports = router;
