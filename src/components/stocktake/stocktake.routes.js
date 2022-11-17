const express = require("express");

const router = express.Router({ mergeParams: true });

const addStocktakeController = require("./controllers/addStocktake.controller");
const getStocktakeController = require("./controllers/getStocktakes.controller");
const deleteStocktakeController = require("./controllers/deleteStocktake.controller");
const updateStocktakeController = require("./controllers/updateStocktake.controller");

router.post("/", addStocktakeController);
router.get("/", getStocktakeController);
router.put("/:stocktakeId", updateStocktakeController);
router.delete("/:stocktakeId", deleteStocktakeController);

module.exports = router;
