const express = require("express");

const addEmployeeController = require("./controllers/addEmployee.controller");
const deleteEmployeeController = require("./controllers/deleteEmployee.controller");
const getAllEmployeeController = require("./controllers/getAllEmployee.controller");
const getEmployeeController = require("./controllers/getEmployee.controller");
const updateEmployeeController = require("./controllers/updateEmployee.controller");
const updateContactController = require("./controllers/updateContectInfo.controller");
const updateAccessController = require("./controllers/updateAccess.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getAllEmployeeController);
router.post("/", addEmployeeController);
router.get("/:empId", getEmployeeController);
router.patch("/:empId", updateEmployeeController);
router.patch("/:empId/contact", updateContactController);
router.patch("/:empId/access", updateAccessController);
router.patch("/:empId", updateEmployeeController);
router.delete(":/empId", deleteEmployeeController);

module.exports = router;
