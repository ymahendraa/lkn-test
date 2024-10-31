import { Request, Response } from "express";
import Task from "../models/TaskModel";
import nodemailer from "nodemailer";
import { verifyToken } from "../middleware/authMiddleware";

// Get all tasks
export const getTasks = [
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
];

// Get a task by ID
export const getTaskById = [
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findById(req.params.id);
      res.json(task);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  },
];

// Create a new task
export const saveTask = [
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    const task = new Task(req.body);
    try {
      const { email } = req.body;

      const insertedTask = await task.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        host: "smtp.gmail.com",
        secure: true,
        // FOR TEST PURPOSES ONLY
        // DO NOT USE THIS IN PRODUCTION
        // USE ENVIRONMENT VARIABLES INSTEAD
        auth: {
          user: "mahendev2@gmail.com", // THIS SHOULD BE YOUR EMAIL
          pass: "ahce dvvo fsoz rrqn", // THIS SHOULD BE YOUR GOOGLE APP PASSWORD
        },
      });

      const mailOptions = {
        from: {
          name: "Task App",
          address: "mahendev2@gmail.com", // THIS SHOULD BE YOUR EMAIL
        },
        to: email,
        subject: "There is a new task",
        text: "Hi Salam Kenal",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(201).json(insertedTask);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },
];

// Update a task by ID
export const updateTask = [
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const updatedTask = await Task.updateOne(
        { _id: req.params.id },
        { $set: req.body }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        host: "smtp.gmail.com",
        secure: true,
        // FOR TEST PURPOSES ONLY
        // DO NOT USE THIS IN PRODUCTION
        // USE ENVIRONMENT VARIABLES INSTEAD
        auth: {
          user: "mahendev2@gmail.com", // THIS SHOULD BE YOUR EMAIL
          pass: "ahce dvvo fsoz rrqn", // THIS SHOULD BE YOUR GOOGLE APP PASSWORD
        },
      });

      const mailOptions = {
        from: {
          name: "Task App",
          address: "mahendev2@gmail.com", // THIS SHOULD BE YOUR EMAIL
        },
        to: email,
        subject: "There is a new task",
        text: "Hi Salam Kenal",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },
];

// Delete a task by ID
export const deleteTask = [
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedTask = await Task.deleteOne({ _id: req.params.id });
      res.json(deletedTask);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },
];
