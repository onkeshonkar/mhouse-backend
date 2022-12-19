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
const announcementRoutes = require("./components/announcement/announcement.routes");

const uploadRoutes = require("./components/uploads/uploads.routes");

const isAuth = require("./middlewares/isAuth");
const isInSameRestaurent = require("./middlewares/isInSameRestaurent");
// const isOwnerOrManager = require("./middlewares/isOwnerOrManager");
const multer = require("./middlewares/multer");

const router = express.Router();

router.use("/user/auth", authRoutes);

router.use("/restaurents/:rId", isAuth, restaurentRoutes);

router.use(
  "/branches/:branchId/payroll-groups",
  isAuth,
  isInSameRestaurent,
  payrollGroupRoutes
);

router.use(
  "/branches/:branchId/employees",
  isAuth,
  isInSameRestaurent,
  employeeRoutes
);

router.use("/user", isAuth, userRoutes);

router.use("/branches/:branchId/", isAuth, isInSameRestaurent, financeRoutes);

router.use(
  "/branches/:branchId/schedules",
  isAuth,
  isInSameRestaurent,
  scheduleRoutes
);

router.use("/branches/:branchId/tasks", isAuth, isInSameRestaurent, taskRoutes);

router.use(
  "/branches/:branchId/budgets",
  isAuth,
  isInSameRestaurent,
  BudgetRoutes
);

router.use(
  "/branches/:branchId/suppliers",
  isAuth,
  isInSameRestaurent,
  supplierRoutes
);

router.use(
  "/branches/:branchId/stocktakes",
  isAuth,
  isInSameRestaurent,
  stocktakeRoutes
);

router.use(
  "/branches/:branchId/catering-orders",
  isAuth,
  isInSameRestaurent,
  cateringOrderRoutes
);

router.use("/branches/:branchId/menu", isAuth, isInSameRestaurent, menuRoutes);

router.use("/uploads", isAuth, multer.any(), uploadRoutes);

router.use(
  "/branches/:branchId/announcements",
  isAuth,
  isInSameRestaurent,
  announcementRoutes
);

router.use("/branches/:branchId", isAuth, isInSameRestaurent, branchRoutes);

module.exports = router;
