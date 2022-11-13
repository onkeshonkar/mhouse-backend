const express = require("express");

const router = express.Router({ mergeParams: true });

const addSupplierController = require("./controllers/addSupplier.controller");
const getSuppliersController = require("./controllers/getSuppliers.controller");

router.post("/", addSupplierController);
router.get("/", getSuppliersController);

module.exports = router;
