const express = require("express");

const addCashRegisterController = require("./controllers/addCashRegister.controller");
const getCashRegistersController = require("./controllers/getCashRegisters.controller");
const addClosingController = require("./controllers/addClosing.controller");
const getClosingsController = require("./controllers/getClosings.controller");
const addFundTransferController = require("./controllers/addFundTransfer.controller");
const getFundTransfersController = require("./controllers/getFundTransfers.controller");
const updateFundTransferStatusController = require("./controllers/updateFundTransferStatus.controller");
const addSafeDepositController = require("./controllers/addSafeDeposit.controller");
const getSafeDepositsController = require("./controllers/getSafeDeposits.controller");

const router = express.Router({ mergeParams: true });

router.get("/cash-register", getCashRegistersController);
router.post("/cash-register", addCashRegisterController);

router.get("/closings", getClosingsController);
router.post("/closings", addClosingController);

router.get("/fund-transfers", getFundTransfersController);
router.post("/fund-transfers", addFundTransferController);
router.patch(
  "/fund-transfers/:fTransferId",
  updateFundTransferStatusController
);

router.get("/safe-deposits", getSafeDepositsController);
router.post("/safe-deposits", addSafeDepositController);

module.exports = router;
