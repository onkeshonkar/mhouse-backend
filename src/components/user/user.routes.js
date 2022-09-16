const express = require("express");

const updateUserProfileController = require("./controllers/updateProfile.controller");
const updatePasswordController = require("./controllers/updatePassword.controller");

const router = express.Router();

router.patch("/:userId/profile", updateUserProfileController);
router.patch("/:userId/password", updatePasswordController);

module.exports = router;
