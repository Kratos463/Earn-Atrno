const { Router } = require("express");
const { addOfficialTask, getAllOfficialTasks } = require("../controllers/officialTasks.controller");
const upload = require("../middlewares/multer.middleware");

const router = Router();

router.route("/add-official-task").post(
    upload.fields([
        { name: "icon", maxCount: 1 }
    ]),
    addOfficialTask
);

router.route("/get-official-tasks").get(getAllOfficialTasks);

module.exports = router;
