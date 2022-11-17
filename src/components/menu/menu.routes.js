const express = require("express");

const router = express.Router({ mergeParams: true });

const addMenuController = require("./controllers/addMenu.controller");
const getAllMenuController = require("./controllers/getAllMenu.controller");
const editMenuByIdController = require("./controllers/editMenuById.controller");

router.post("/", addMenuController);
router.get("/", getAllMenuController);
router.patch("/:menuId", editMenuByIdController);

module.exports = router;
