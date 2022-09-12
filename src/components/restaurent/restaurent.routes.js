const express = require("express");

const addBranchController = require("./controllers/addBranch.controller");
const deleteBranchController = require("./controllers/deleteBranch.controller");
const getAllBranchController = require("./controllers/getAllBranch.controller");
const updateBranchController = require("./controllers/updateBranch.controller");
const updateRestaurentController = require("./controllers/updateRestaurent.controller");

const router = express.Router();

module.exports = router;
