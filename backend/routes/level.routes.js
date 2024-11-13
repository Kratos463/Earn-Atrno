const { Router } = require("express");
const { 
    createLevel, deleteLevel, updateLevel, getSingleLevel, getAllLevels
} = require("../controllers/level.controller");
const upload = require("../middlewares/multer.middleware");

const router = Router();

// Route for creating a new level with a character upload
router.route("/").post( 
    upload.fields([{ name: "character", maxCount: 1 }]),
    createLevel
);

// Route for updating a level by ID
router.route("/:id").patch(updateLevel);

router.route("/single").get(getSingleLevel);

// Route for getting all levels
router.route("/").get(getAllLevels);

// Route for deleting a level by ID
router.route("/:id").delete(deleteLevel);

module.exports = router;
