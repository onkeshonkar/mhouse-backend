const express = require("express");

const authRoutes = require("./components/auth/auth.routes");
const branchRoutes = require("./components/branch/branch.routes");
const restaurentRoutes = require("./components/restaurent/restaurent.routes");
const payrollGroupRoutes = require("./components/payrollGroup/payrollGroup.routes");
const employeeRoutes = require("./components/employee/employee.routes");
const financeRoutes = require("./components/finance/finance.routes");
const scheduleRoutes = require("./components/schedule/schedule.routes");
const taskRoutes = require("./components/task/task.routes");
const BudgetRoutes = require("./components/budget/budget.routes");
const userRoutes = require("./components/user/user.routes");
const supplierRoutes = require("./components/supplier/supplier.routes");
const stocktakeRoutes = require("./components/stocktake/stocktake.routes");
const cateringOrderRoutes = require("./components/cateringOrder/cateringOrder.routes");
const menuRoutes = require("./components/menu/menu.routes");

const uploadRoutes = require("./components/uploads/uploads.routes");

const isAuth = require("./middlewares/isAuth");
const isInSameRestaurent = require("./middlewares/isInSameRestaurent");
const isOwnerOrManager = require("./middlewares/isOwnerOrManager");
const multer = require("./middlewares/multer");

const router = express.Router();

router.use("/user/auth", authRoutes);

router.use("/restaurents/:rId", restaurentRoutes);

router.use(
  "/branches/:branchId/payroll-groups",

  isInSameRestaurent,
  payrollGroupRoutes
);

router.use(
  "/branches/:branchId/employees",

  isInSameRestaurent,
  employeeRoutes
);

router.use("/user", userRoutes);

router.use("/branches/:branchId/", isInSameRestaurent, financeRoutes);

router.use(
  "/branches/:branchId/schedules",
  isInSameRestaurent,

  scheduleRoutes
);

router.use("/branches/:branchId/tasks", isInSameRestaurent, taskRoutes);

router.use(
  "/branches/:branchId/budgets",
  isInSameRestaurent,

  BudgetRoutes
);

router.use(
  "/branches/:branchId/suppliers",
  isInSameRestaurent,

  supplierRoutes
);

router.use(
  "/branches/:branchId/stocktakes",
  isInSameRestaurent,

  stocktakeRoutes
);

router.use(
  "/branches/:branchId/catering-orders",
  isInSameRestaurent,

  cateringOrderRoutes
);

router.use("/branches/:branchId/menu", isInSameRestaurent, menuRoutes);

router.use("/uploads", multer.any(), uploadRoutes);

router.use(
  "/branches/:branchId",
  isInSameRestaurent,
  isOwnerOrManager,
  branchRoutes
);

module.exports = router;
