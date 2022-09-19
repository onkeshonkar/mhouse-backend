const express = require("express");

const router = express.Router({ mergeParams: true });

const addTaskController = require("./controllers/addTask.controller");
const getTaskController = require("./controllers/getTasks.controller");
const updateTaskStatusController = require("./controllers/updateTaskStatus.controller");
const deleteTaskController = require("./controllers/deleteTask.controller");

router.get("/", getTaskController);
router.post("/", addTaskController);
router.patch("/:taskId", updateTaskStatusController);
router.delete("/:taskId", deleteTaskController);

module.exports = router;
