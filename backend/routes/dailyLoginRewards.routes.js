const {Router} = require("express")
const { createDailyLoginReward, getSingleDailyReward, getAllDailyRewards, updateDailyLoginReward, deleteDailyLoginReward } = require("../controllers/dailyLogin.controller")

const router = Router()

router.route("/create-daily-login-reward").post(createDailyLoginReward)
router.route("/get-single-daily-login-reward").get(getSingleDailyReward)
router.route("/get-all-daily-login-reward").get(getAllDailyRewards)
router.route("/update-daily-login-reward/:id").patch(updateDailyLoginReward)
router.route("/delete-daily-login-reward/:id").delete(deleteDailyLoginReward)

module.exports= router