const express = require("express");

const updateBussinessDataController = require("./controllers/updateBussinessData.controller");

const router = express.Router({ mergeParams: true });

router.put("/businnes-details", updateBussinessDataController);

module.exports = router;
