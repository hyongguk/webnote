const express = require("express");
//const { get } = require("../server/server");
const router = express.Router();
const api = express.Router();
const db = require("../models/index.js");

router.get("/api", async (req, res) => {
  console.log("ここにきた");
  const data = await db.table("notes").orderBy("update_at", "desc");
  res.json(data);
});
//update title and body in notes table based on id
router.put("/api/notes/:id", async (req, res) => {
  const note_id = req.params.id;
  console.log(typeof note_id);
  console.log(req.body);
  await db
    .table("notes")
    .where({ id: note_id })
    .update({
      title: req.body.title,
      body: req.body.body,
      update_at: req.body.update_at
    });

  //  const data = await db.table('notes').
  res.send("putから");
});
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
