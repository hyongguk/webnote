const express = require("express");
//const { get } = require("../server/server");
const router = express.Router();
const api = express.Router();
const db = require("../models/index.js");

router.get("/api", async (req, res) => {
  console.log("ここにきた");
  const data = await db.table("notes");
  res.json(data);
});

//全てノートと最新のノート本文を返す
// api.get("/api", async (req, res) => {
//   const data = await db.select().from("users");
//   res.send(data);
// });

// //ノートを作成する
// api.post("/api", (req, res) => {});

// //ノートの内容を返す
// api.get("/api/:title", (req, res) => {});

// //ノートを更新する
// api.patch("/api/:title", (req, res) => {});

// //ノートを削除する
// api.delete("/api/:title", (req, res) => {});
// //ノートを検索する
// // TODO

module.exports = api;
module.exports = router;
