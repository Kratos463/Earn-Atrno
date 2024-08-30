const {Router} = require("express")
const { createLevel, updateLevel, deleteLevel, getAllLevels, getSingleLevel } = require("../controllers/level.controller")

const router = Router()

router.route("/create-level").post(createLevel)
router.route("/update-level/:id").patch(updateLevel)
router.route("/get-level").get(getAllLevels)
router.route("/get-single-level").get(getSingleLevel)
router.route("/delete-level/:id").delete(deleteLevel)

module.exports = router