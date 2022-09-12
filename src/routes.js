const express = require("express");

const router = express.Router();

const authRoute = require("./components/auth/auth.routes");
const branchRoute = require("./components/branch/branch.routes");

const auth = require("./middlewares/auth");

router.use("/user/auth", authRoute);
router.use("/branch", auth, branchRoute);

module.exports = router;
