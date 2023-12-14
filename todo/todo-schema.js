const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Todo = new mongoose.model("Todo", todoSchema);
module.exports = Todo;
