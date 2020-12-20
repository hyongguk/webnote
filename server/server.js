const express = require("express");
const path = require("path");
const app = express();
//const db = require("../models/index.js");
const cors = require("cors");

const morgan = require("morgan");

const api = require("../controllers");
const router = require("../controllers");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(cors());
app.use("/api", express.json(), express.urlencoded({ extended: true }), api);
app.use("/", router);
app.use(express.static(path.join(__dirname, "../build")));
app.get("/", (req, res) => {
  console.log("in server.js");
  res.send("どうぞ");
});
module.exports = app;
