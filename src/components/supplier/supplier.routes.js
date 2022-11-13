const express = require("express");

const router = express.Router({ mergeParams: true });

const addSupplierController = require("./controllers/addSupplier.controller");

router.post("/", addSupplierController);

module.exports = router;
