const { Router } = require("express")
const {
    createMultiTapBoost,
    createEnergyBoost,
    boostMemberEnergy,
    boostMemberMultiTap,
    getAllMultiTapBooster,
    getAllEnergyBooster,
    deleteMultiTapBoost,
    deleteEnergyBoost,
    updateEnergyBoost,
    updateMultitapBoost
} = require("../controllers/boost.controller")
const VerifyMember = require("../middlewares/verifyMember.middleware")

const router = Router()


router.route("/create-multitap-booster").post(createMultiTapBoost)
router.route("/create-energy-booster").post(createEnergyBoost)
router.route("/get-multitap-booster").get(getAllMultiTapBooster)
router.route("/get-energy-booster").get(getAllEnergyBooster)
router.route("/delete-multitap-booster/:multiTapId").delete(deleteMultiTapBoost)
router.route("/delete-energy-booster/:energyId").delete(deleteEnergyBoost)
router.route("/update-energy-booster/:energyId").patch(updateEnergyBoost)
router.route("/update-multitap-booster/:multitapId").patch(updateMultitapBoost)


// boost by user
router.route("/boost-energy").post(VerifyMember, boostMemberEnergy)
router.route("/boost-ontap").post(VerifyMember, boostMemberMultiTap)


module.exports = router