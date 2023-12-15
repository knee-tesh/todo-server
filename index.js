const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./todo/index");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).send("Hello");
});

app.use("/todo", Todo);

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
