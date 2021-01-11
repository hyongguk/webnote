const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const api = require("../controllers");
const router = require("../controllers");
//const expressSession = require('express-session');

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(cors());
app.use("/api", express.json(), express.urlencoded({ extended: true }), api);
app.use("/", router);

module.exports = app;
