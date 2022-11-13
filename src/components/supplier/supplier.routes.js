const express = require("express");

const router = express.Router({ mergeParams: true });

const addSupplierController = require("./controllers/addSupplier.controller");
const getSuppliersController = require("./controllers/getSuppliers.controller");
const getSupplierByIdController = require("./controllers/getSupplierById.controller");

router.post("/", addSupplierController);
router.get("/", getSuppliersController);
router.get("/:supplierId", getSupplierByIdController);

module.exports = router;
