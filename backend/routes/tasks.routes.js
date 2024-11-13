const { Router } = require("express");
const {
    addOfficialTask,
    getAllOfficialTasks,
    claimDailyTask,
    claimOfficialTask
} = require("../controllers/officialTasks.controller");
const upload = require("../middlewares/multer.middleware");
const {
    createDailyTask,
    updateDailyTask,
    getAllDailyTasks,
    getSingleDailyTask,
    deleteDailyTask
} = require("../controllers/daliyTask.controller");
const VerifyMember = require("../middlewares/verifyMember.middleware");

const router = Router();

// Route for creating a new official task with icon upload
router.route("/official-tasks").post(
    upload.fields([{ name: "icon", maxCount: 1 }]),
    addOfficialTask
);

// Route for retrieving all official tasks
router.route("/official-tasks").get(getAllOfficialTasks);

// Route for daily task
router.route("/daily-task").post(createDailyTask)
router.route("/daily-task/:taskId").patch(updateDailyTask)
router.route("/daily-task").get(getAllDailyTasks)
router.route("/daily-task/:taskId").get(getSingleDailyTask)
router.route("/daily-task/:taskId").delete(deleteDailyTask)


// route for claim the reward

router.route("/daily-task/claim/:taskId").post(VerifyMember, claimDailyTask)
router.route("/official-task/claim/:taskId").post(VerifyMember, claimOfficialTask)

module.exports = router;
