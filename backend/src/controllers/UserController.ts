import { Request, Response } from "express";
import User from "../models/UserModel";

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

// Create a new user
export const saveUser = async (req: Request, res: Response): Promise<void> => {
  const user = new User(req.body);
  try {
    const insertedUser = await user.save();
    res.status(201).json(insertedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.params.id });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
