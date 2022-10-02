const express = require("express");
const isOwner = require("../../middlewares/isOwner");

const addPayrollGroupController = require("./controllers/addPayrollGroup.controller");
const deletePayrollGroupController = require("./controllers/deletePayrollGroup.controller");
const getAllPayrollGroupController = require("./controllers/getAllPayrollGroup.controller");
const updatePayrollGroupController = require("./controllers/updatePayrollGroup.controller");

const router = express.Router({ mergeParams: true });

router.post("/", isOwner, addPayrollGroupController);
router.get("/", getAllPayrollGroupController);
router.patch("/:pgId", isOwner, updatePayrollGroupController);
router.delete("/:pgId", isOwner, deletePayrollGroupController);

module.exports = router;
