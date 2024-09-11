const { Router } = require("express")
const { fetchMembers } = require("../controllers/admin.controller")

const router = Router()

router.route("/members").get(fetchMembers)



module.exports = router