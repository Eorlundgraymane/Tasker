import express from 'express';

import mainController from '../controllers/mainController.js';

const router = express.Router();

router.post("/addTask", mainController.addTask);
router.post("/deleteTask", mainController.deleteTask);
router.post("/updateTask", mainController.updateTask);
router.post("/moveTask", mainController.moveTask);
router.get("/", mainController.loadTasker);

export default router;
