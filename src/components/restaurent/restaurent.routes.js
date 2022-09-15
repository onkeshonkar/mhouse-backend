const express = require("express");

const addBranchController = require("./controllers/addBranch.controller");
const deleteBranchController = require("./controllers/deleteBranch.controller");
const getAllBranchController = require("./controllers/getAllBranch.controller");
const updateBranchController = require("./controllers/updateBranch.controller");
const updateBussinessDataController = require("./controllers/updateBussinessData.controller");

const isSameResturent = require("../../middlewares/isSameRestaurent");

const router = express.Router({ mergeParams: true });

router.get("/branches", getAllBranchController);
router.post("/branches", addBranchController);
router.put("/branches/:branchId", isSameResturent, updateBranchController);
router.delete("/branches/:branchId", isSameResturent, deleteBranchController);

router.get("/businnes-details", updateBussinessDataController);

module.exports = router;
