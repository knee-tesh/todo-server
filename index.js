const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).send("Hello");
});

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

// middleware that is specific to this router
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
app.get("/todo/", async (req, res) => {
  const todoItems = await Todo.find({});
  console.log({ todoItems });
  res.status(200).send(todoItems);
});

// add new todo
app.post("/todo/", async (req, res) => {
  try {
    console.log("add new item call");
    const { body } = req;
    console.log({ body });
    const { name, status } = body;
    if (!name || !status) {
      return res.status(401).send("Missing params to create todo");
    }
    const todo = await Todo.create({ name, status });
    res.status(201).send(todo);
  } catch (err) {
    console.log({ err });
    res.status(501).send("some error occurred");
  }
});

app.post("/todo/update", async (req, res) => {
  try {
    const { _id } = req.body;
    console.log("update call for id -", _id);
    const { name, status } = req.body;
    if (!name || !status || !_id) {
      return res.status(400).json({ message: "nothing to update" });
    }
    const todoItem = await Todo.findByIdAndUpdate(_id, { name, status });
    res.status(200).send(todoItem);
  } catch (err) {
    res.status(501).send({ message: err.message || "Cannot update Todo" });
  }
});

app.delete("/todo/delete", async (req, res) => {
  try {
    const { _id } = req.body;
    await Todo.findByIdAndDelete(_id);
    res.status(203).send({ message: "successfully deleted" });
  } catch (err) {
    console.log({ err });
    res.status(501).send({ message: err.message || "Some error occurred" });
  }
});

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("App successfully connected to db");
    app.listen(PORT, () => console.log("Server is running on port -", PORT));
  })
  .catch((err) => {
    console.log("error connecting db", err);
  });

module.exports = app;
