const express = require("express");
//const { get } = require("../server/server");
const router = express.Router();
const api = express.Router();
const db = require("../models/index.js");

//login
router.post("/api/users", async (req, res) => {
  const user = await db
    .table("users")
    .where({ email_adress: req.body.email, password: req.body.password });
  if (user.length != 0) {
    console.log(user[0].user_id);
    res.json({ user_id: user[0].user_id });
  } else {
    res.send("false");
  }
});

//get all notes of user who log in now
router.get("/api/notes", async (req, res) => {
  console.log("req.bodyは.....", req.query.user_id);
  const userIdJson = await db
    .table("users")
    .select("user_id")
    .where({ email_adress: req.query.user_id });
  const userId = userIdJson[0].user_id;
  const data = await db
    .table("notes")
    .where({ user_id: userId })
    .orderBy("update_at", "desc");
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
    });
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
module.exports = api;
module.exports = router;
