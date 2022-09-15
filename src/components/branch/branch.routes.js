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

const updateSettingsController = require("./controllers/updateSettings.controller");
const updateNotificationsController = require("./controllers/updateNotifications.controller");

const router = express.Router({ mergeParams: true });

router
  .route("/departments")
  .get(getDepartmentController)
  .post(addDepartmentController)
  .delete(deleteDepartmentController);

router
  .route("/roles")
  .get(getRoleController)
  .post(addRoleController)
  .delete(deleteRoleController);

router
  .route("/job-titles")
  .get(getJobTitleController)
  .post(addJobTitleController)
  .delete(deleteJobTitleController);

router.put("/settings", updateSettingsController);
router.put("/notifications", updateNotificationsController);

module.exports = router;
