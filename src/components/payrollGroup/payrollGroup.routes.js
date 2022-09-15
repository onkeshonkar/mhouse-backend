const express = require("express");

const addPayrollGroupController = require("./controllers/addPayrollGroup.controller");
const deletePayrollGroupController = require("./controllers/deletePayrollGroup.controller");
const getAllPayrollGroupController = require("./controllers/getAllPayrollGroup.controller");
const updatePayrollGroupController = require("./controllers/updatePayrollGroup.controller");

const router = express.Router({ mergeParams: true });

router.post("/", addPayrollGroupController);
router.get("/", getAllPayrollGroupController);
router.patch("/:pgId", updatePayrollGroupController);
router.delete("/:pgId", deletePayrollGroupController);

module.exports = router;
