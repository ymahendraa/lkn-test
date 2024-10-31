import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/UserRoute";
import authRoutes from "./routes/AuthRoute";
import taskRoutes from "./routes/TaskRoute";
import dotenv from "dotenv";

// load environment variables
dotenv.config();

const app = express();
mongoose.connect("mongodb://localhost:27017/lkn-mongo");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(express.json());
app.use("/api", [userRoutes, authRoutes, taskRoutes]);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
