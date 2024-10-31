import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
