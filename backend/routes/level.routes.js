const {Router} = require("express")
const { createLevel, updateLevel, deleteLevel, getAllLevels, getSingleLevel } = require("../controllers/level.controller")
const upload = require("../middlewares/multer.middleware");

const router = Router()

router.route("/create-level").post(
    upload.fields([
        { name: "character", maxCount: 1 }
    ]),
    createLevel
)
router.route("/update-level/:id").patch(updateLevel)
router.route("/get-single-level").get(getSingleLevel)
router.route("/delete-level/:id").delete(deleteLevel)

module.exports = router