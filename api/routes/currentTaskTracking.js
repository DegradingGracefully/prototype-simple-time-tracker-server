const express = require("express");
const router = express.Router();
const currentTaskTrackingController = require("../controllers/currentTaskTrackingController");

router.get("/", currentTaskTrackingController.allCurrentTaskTracking);
router.post("/", currentTaskTrackingController.addCurrentTaskTracking);
router.delete("/", currentTaskTrackingController.deleteCurrentTaskTracking);
router.put("/", currentTaskTrackingController.updateCurrentTaskTracking);

module.exports = router;