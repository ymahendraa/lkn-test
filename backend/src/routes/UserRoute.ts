import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  saveUser,
  updateUser,
} from "../controllers/UserController";

const router = express.Router();

// route to get all users
router.get("/users", getUsers);

// route to get a user by ID
router.get("/users/:id", getUserById);

// route to create a new user
router.post("/users", saveUser);

// route to update a user by ID
router.patch("/users/:id", updateUser);

// route to delete a user by ID
router.delete("/users/:id", deleteUser);

export default router;
