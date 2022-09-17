const express = require("express");

const addScheduleController = require("./controllers/addSchedule.controller");
const deleteScheduleController = require("./controllers/deleteSchedule.controller");
const getSchedulesController = require("./controllers/getSchedules.controller");
const publishScheduleByWeekController = require("./controllers/publishSchedules.controller");
const updateScheduleController = require("./controllers/updateSchedule.controller");

const router = express.Router({ mergeParams: true });

router.get("/", getSchedulesController);
router.post("/", addScheduleController);
router.patch("/:scheduleId", updateScheduleController);
router.delete("/:scheduleId", deleteScheduleController);

router.post("/action/publish", publishScheduleByWeekController);

module.exports = router;
