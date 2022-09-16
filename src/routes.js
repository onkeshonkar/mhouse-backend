const express = require("express");

const authRoutes = require("./components/auth/auth.routes");
const branchRoutes = require("./components/branch/branch.routes");
const restaurentRoutes = require("./components/restaurent/restaurent.routes");
const payrollGroupRoutes = require("./components/payrollGroup/payrollGroup.routes");
const employeeRoutes = require("./components/employee/employee.routes");

const isAuth = require("./middlewares/isAuth");
const isInSameRestaurent = require("./middlewares/isInSameRestaurent");
const isOwnerOrManager = require("./middlewares/isOwnerOrManager");

const router = express.Router();

router.use("/user/auth", authRoutes);

router.use(
  "/branches/:branchId",
  isAuth,
  isInSameRestaurent,
  isOwnerOrManager,
  branchRoutes
);

router.use("/restaurents/:rId", isAuth, restaurentRoutes);

router.use(
  "/branches/:branchId/payroll-groups",
  isAuth,
  isInSameRestaurent,
  isOwnerOrManager,
  payrollGroupRoutes
);

router.use(
  "/branches/:branchId/employees",
  isAuth,
  isInSameRestaurent,
  employeeRoutes
);

module.exports = router;
