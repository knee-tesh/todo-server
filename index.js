const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const todo = require("./todo/index");

const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).send("Hello");
});

app.use("/todo", todo);

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("App successfully connected to db");
    app.listen(3214, () => console.log("Server is running on port 3214"));
  })
  .catch((err) => {
    console.log("error connecting db", err);
  });