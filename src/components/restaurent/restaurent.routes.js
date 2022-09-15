const express = require("express");

const addBranchController = require("./controllers/addBranch.controller");
const deleteBranchController = require("./controllers/deleteBranch.controller");
const getAllBranchController = require("./controllers/getAllBranch.controller");
const updateBranchController = require("./controllers/updateBranch.controller");
const updateRestaurentController = require("./controllers/updateRestaurent.controller");

const router = express.Router();

router.get("/branches", getAllBranchController);
router.post("/branches", addBranchController);
router.put("/branches", updateBranchController);
router.delete("/branches", deleteBranchController);
router.get("/branches", getAllBranchController);

module.exports = router;
