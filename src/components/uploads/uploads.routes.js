const express = require("express");

const uploadAvatarController = require("./controllers/uploadAvatar.controller");
const uploadCertificatesController = require("./controllers/uploadCertificates.controller");
const uploadEmpDocsControllers = require("./controllers/uploadEmpDocs.controllers");
const uploadResumeController = require("./controllers/uploadResume.controller");

const router = express.Router();

router.post("/avatar", uploadAvatarController);
router.post("/certificates", uploadCertificatesController);
router.post("/resume", uploadResumeController);
router.post("/employee-docs", uploadEmpDocsControllers);

module.exports = router;
