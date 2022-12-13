const express = require("express");

const router = express.Router({ mergeParams: true });

const addSupplierController = require("./controllers/addSupplier.controller");
const getSuppliersController = require("./controllers/getSuppliers.controller");
const getSupplierByIdController = require("./controllers/getSupplierById.controller");
const addOrderController = require("./controllers/addOrder.controller");
const updateOrderStatusController = require("./controllers/updateOrderStatus.contoller");
const getSuppOrdersController = require("./controllers/getSuppOrder.controller");
const deleteSupplierController = require("./controllers/deleteSupplier.controller");

router.post("/", addSupplierController);
router.get("/", getSuppliersController);
router.get("/:supplierId", getSupplierByIdController);
router.delete("/:supplierId", deleteSupplierController);

router.get("/:supplierId/orders", getSuppOrdersController);
router.post("/orders", addOrderController);
router.patch("/orders/:orderId", updateOrderStatusController);

module.exports = router;
