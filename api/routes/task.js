const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/", taskController.allTask);
router.post("/", taskController.addTask);
router.delete("/:taskId", taskController.deleteTask);
router.delete("/", taskController.deleteAllTask);
router.put("/:taskId", taskController.updateTask);

module.exports = router;