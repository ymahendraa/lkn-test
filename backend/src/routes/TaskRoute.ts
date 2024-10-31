import express from "express";
import {
  getTaskById,
  getTasks,
  saveTask,
  updateTask,
  deleteTask,
} from "../controllers/TaskController";

const router = express.Router();

// route to get all tasks
router.get("/tasks", getTasks);

// route to get a task by ID
router.get("/tasks/:id", getTaskById);

// route to create a new task
router.post("/tasks", saveTask);

// route to update a task by ID
router.patch("/tasks/:id", updateTask);

// route to delete a task by ID
router.delete("/tasks/:id", deleteTask);

export default router;
