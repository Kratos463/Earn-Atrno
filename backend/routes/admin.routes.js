const { Router } = require("express")
const { fetchMembers } = require("../controllers/admin.controller")
const { getAllLevels } = require("../controllers/level.controller")

const router = Router()

router.route("/members").get(fetchMembers)
router.route("/get-level").get(getAllLevels)


module.exports = router