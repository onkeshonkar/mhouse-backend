const express = require("express");

const addDepartmentController = require("./controllers/addDepartment.controller");
const addJobTitleController = require("./controllers/addJobTitle.controller");
const addRoleController = require("./controllers/addRole.controller");
const deleteDepartmentController = require("./controllers/deleteDepartment.controller");
const deleteJobTitleController = require("./controllers/deleteJobTitle.controller");
const deleteRoleController = require("./controllers/deleteRole.controller");
const getDepartmentController = require("./controllers/getDepartment.controller");
const getJobTitleController = require("./controllers/getJobTitle.controller");
const getRoleController = require("./controllers/getRole.controller");

const router = express.Router();

router
  .get("/:branchId/departments", getDepartmentController)
  .post("/:branchId/departments", addDepartmentController)
  .delete("/:branchId/departments", deleteDepartmentController);

router
  .get("/:branchId/roles", getRoleController)
  .post("/:branchId/roles", addRoleController)
  .delete("/:branchId/roles", deleteRoleController);

router
  .get("/:branchId/jobTitles", getJobTitleController)
  .post("/:branchId/jobTitles", addJobTitleController)
  .delete("/:branchId/jobTitles", deleteJobTitleController);

module.exports = router;
