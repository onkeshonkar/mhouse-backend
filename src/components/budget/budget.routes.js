const express = require("express");

const addBudgetController = require("./controllers/addBudget.controller");
const getBudgetsController = require("./controllers/getBudgets.controller");

const router = express.Router({ mergeParams: true });

router.post("/", addBudgetController);
router.get("/", getBudgetsController);

module.exports = router;
