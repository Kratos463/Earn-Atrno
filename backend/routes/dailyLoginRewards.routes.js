const { Router } = require("express");
const { 
    createDailyLoginReward,
    getSingleDailyReward,
    getAllDailyRewards,
    updateDailyLoginReward,
    deleteDailyLoginReward
} = require("../controllers/dailyLogin.controller");

const router = Router();

// Route for creating a new daily login reward
router.route("/").post(createDailyLoginReward);

// Route for getting a single daily login reward by ID
router.route("/:id").get(getSingleDailyReward); 

// Route for fetching all daily login rewards
router.route("/").get(getAllDailyRewards);

// Route for updating a daily login reward by ID
router.route("/:id").patch(updateDailyLoginReward);

// Route for deleting a daily login reward by ID
router.route("/:id").delete(deleteDailyLoginReward);

module.exports = router;
