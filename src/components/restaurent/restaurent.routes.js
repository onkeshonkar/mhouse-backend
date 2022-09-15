const express = require("express");

const addBranchController = require("./controllers/addBranch.controller");
const deleteBranchController = require("./controllers/deleteBranch.controller");
const getAllBranchController = require("./controllers/getAllBranch.controller");
const updateBranchController = require("./controllers/updateBranch.controller");
const updateBussinessDataController = require("./controllers/updateBussinessData.controller");

const isInSameResturent = require("../../middlewares/isInSameRestaurent");

const router = express.Router({ mergeParams: true });

router.get("/branches", getAllBranchController);
router.post("/branches", addBranchController);
router.patch("/branches/:branchId", isInSameResturent, updateBranchController);
router.delete("/branches/:branchId", isInSameResturent, deleteBranchController);

router.get("/businnes-details", updateBussinessDataController);

module.exports = router;
