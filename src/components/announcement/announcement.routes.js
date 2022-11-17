const express = require("express");

const router = express.Router({ mergeParams: true });

const addAnnouncementController = require("./controllers/addAnnouncement.controller");
const getAnnouncementController = require("./controllers/getAnnouncements.controller");

router.post("/", addAnnouncementController);
router.get("/", getAnnouncementController);

module.exports = router;
