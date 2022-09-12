const express = require("express");

const router = express.Router();

const checkinController = require("./controllers/checkin.controller");
const checkoutController = require("./controllers/checkout.controller");
const invitationInfoController = require("./controllers/invitationInfo.controller");
const isEmailAvailableController = require("./controllers/isEmailAvailable.controller");
const loginController = require("./controllers/login.controller");
const registerController = require("./controllers/register.controller");
const resetpasswordGeneratorController = require("./controllers/resetPasswordGenerate.controller");
const resetPasswordInfoController = require("./controllers/resetPasswordInfo.controller");
const resetPasswordController = require("./controllers/resetPassword.controller");
const createPasswordController = require("./controllers/createPassword.controller");
const verifyOtpController = require("./controllers/verifyOtp.controller");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/reset-password/generate", resetpasswordGeneratorController);
router.post("/reset-password/info", resetPasswordInfoController);
router.post("/reset-password", resetPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/invitation/info", invitationInfoController);
router.post("/invitation/create-password", createPasswordController);
router.get("/is-email-available", isEmailAvailableController);
router.post("/checkin", checkinController);
router.post("/checkout", checkoutController);

module.exports = router;
