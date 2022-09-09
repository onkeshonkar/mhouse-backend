const express = require("express");

const router = express.Router();

const authRoute = require("./components/auth/auth.routes");

router.use("/user/auth", authRoute);

module.exports = router;
