const { Router } = require("express");
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
} = require("../controllers/boost.controller");
const VerifyMember = require("../middlewares/verifyMember.middleware");

const router = Router();

// Create Boosters 
router.route("/multitap").post(createMultiTapBoost);
router.route("/energy").post(createEnergyBoost);

// Get All Boosters
router.route("/multitaps").get(getAllMultiTapBooster);
router.route("/energys").get(getAllEnergyBooster);

// Get Single Booster (with member verification)
router.route("/energy").get(VerifyMember, getSingleEnergyBooster);
router.route("/multitap").get(VerifyMember, getSingleTapBooster);

// Delete Boosters
router.route("/multitap/:boosterId").delete(deleteMultiTapBoost);
router.route("/energy/:boosterId").delete(deleteEnergyBoost);

// Update Boosters
router.route("/multitap/:boosterId").patch(updateMultitapBoost);
router.route("/energy/:boosterId").patch(updateEnergyBoost);

// Boost by User (with member verification)
router.route("/energy/:boosterId/boost").post(VerifyMember, boostEnergyBooster);
router.route("/multitap/:boosterId/boost").post(VerifyMember, boostTapBooster);

module.exports = router;
