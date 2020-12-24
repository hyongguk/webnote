const express = require("express");
//const { get } = require("../server/server");
const router = express.Router();
const api = express.Router();
const db = require("../models/index.js");

router.get("/api/notes/", async (req, res) => {
  const data = await db
    .table("notes")
    .orderBy("update_at", "desc")
    .reject(new Error("fail to get!"));
  res.json(data);
});
//update title and body in notes table based on id
router.put("/api/notes/:id", async (req, res) => {
  const note_id = req.params.id;
  await db
    .table("notes")
    .where({ id: note_id })
    .update({
      title: req.body.title,
      body: req.body.body,
      update_at: req.body.update_at
    });
  res.send("putから");
});

//post new note in notes
router.post("/api/notes/", async (req, res) => {
  const data = req.body;
  const returning = await db
    .table("notes")
    .returning("id")
    .insert({
      title: data.title,
      body: data.body,
      update_at: data.update_at,
      user_id: data.user_id
    })
    .reject(new Error("failed to post notes"));
  console.log("returningは", returning);
  res.json(returning[0]);
});
//ノートを削除する
router.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  await db
    .table("notes")
    .where("id", id)
    .del();

  res.send("delete");
});
// //ノートを検索する
// // TODO

module.exports = api;
module.exports = router;
