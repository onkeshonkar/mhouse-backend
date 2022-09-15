const express = require("express");

const authRoute = require("./components/auth/auth.routes");
const branchRoute = require("./components/branch/branch.routes");
const restaurentRoute = require("./components/restaurent/restaurent.routes");

const isAuth = require("./middlewares/isAuth");
const isSameRestaurent = require("./middlewares/isSameRestaurent");

const router = express.Router();

router.use("/user/auth", authRoute);
router.use("/branches/:branchId", isAuth, isSameRestaurent, branchRoute);
router.use("/restaurents", isAuth, restaurentRoute);

module.exports = router;
