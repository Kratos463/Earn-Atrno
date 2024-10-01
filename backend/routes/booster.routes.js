const { Router } = require("express")
const {
    createMultiTapBoost,
    createEnergyBoost,
    getAllMultiTapBooster,
    getAllEnergyBooster,
    deleteMultiTapBoost,
    deleteEnergyBoost,
    updateEnergyBoost,
    updateMultitapBoost,
    getSingleEnergyBooster,
    getSingleTapBooster,
    boostEnergyBooster,
    boostTapBooster,
} = require("../controllers/boost.controller")
const VerifyMember = require("../middlewares/verifyMember.middleware")

const router = Router() 


router.route("/create-multitap-booster").post(createMultiTapBoost)
router.route("/create-energy-booster").post(createEnergyBoost)
router.route("/get-multitap-booster").get(getAllMultiTapBooster)
router.route("/single-energy-booster").get(VerifyMember, getSingleEnergyBooster)
router.route("/single-tap-booster").get(VerifyMember,  getSingleTapBooster)
router.route("/get-energy-booster").get(getAllEnergyBooster)
router.route("/delete-multitap-booster/:multiTapId").delete(deleteMultiTapBoost)
router.route("/delete-energy-booster/:energyId").delete(deleteEnergyBoost)
router.route("/update-energy-booster/:energyId").patch(updateEnergyBoost)
router.route("/update-multitap-booster/:multitapId").patch(updateMultitapBoost)


// boost by user
router.route("/boost-energy/:boosterId").post(VerifyMember, boostEnergyBooster)
router.route("/boost-tap/:boosterId").post(VerifyMember, boostTapBooster)


module.exports = router