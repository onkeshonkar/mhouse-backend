const express = require("express");

const getUsersController = require("./controllers/getUsers.controller");
const updateUserProfileController = require("./controllers/updateProfile.controller");
const updatePasswordController = require("./controllers/updatePassword.controller");

const router = express.Router();

router.get("/", getUsersController);
router.patch("/:userId/profile", updateUserProfileController);
router.patch("/:userId/password", updatePasswordController);

module.exports = router;
