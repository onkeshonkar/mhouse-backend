const express = require("express");

const router = express.Router({ mergeParams: true });

const addCateringOrderController = require("./controllers/addCateringOrder.controller");
const getCateringOrdersController = require("./controllers/getCateringOrders.controller");
const updateOrderStatusController = require("./controllers/updateOrderStatus.contrller");

router.post("/", addCateringOrderController);
router.get("/", getCateringOrdersController);
router.patch("/:orderId", updateOrderStatusController);

module.exports = router;
