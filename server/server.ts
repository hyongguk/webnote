import express from 'express'
import path from "path"
import cors from "cors"
import morgan from "morgan"

const api = require('../controllers')
const app = express()
const router = require("../controllers")

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, "../client/public")));
app.use("/api", express.json(), express.urlencoded({ extended: true }), api);
app.use("/", router);

module.exports = app