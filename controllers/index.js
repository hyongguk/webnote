const express = require("express");
const router = express.Router();
const api = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/index.js");
const passport = require("passport");
const cookieSession = require("cookie-session");

router.use(require("cookie-parser")());
router.use(
  cookieSession({
    name: "mysession",
    keys: ["vueauthrandomkey"],
    maxAge: 24 * 60 * 60 * 1000
  })
);
router.use(passport.initialize());
router.use(passport.session());
//login
// router.post("/api/login/", async (req, res) => {
//   try {
//     const user = await db
//       .table("users")
//       .where({ email_adress: req.body.email, password: req.body.password });
//     if (user.length != 0) {
//       console.log(user[0].user_id);
//       res.json({ user_id: user[0].user_id });
//     } else {
//       res.send("false");
//     }

//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });
//login by using passport

router.post("/api/login", (req, res, next) => {
  console.log(req.session.passport);
  passport.authenticate("local", (err, user, info) => {
    console.log("comming in line 41");
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log("in line 47");
      return res.status(400).send([user, "Cannot log in", info]);
    }

    req.login(user, () => {
      console.log("login method");
      res.send("Logged in");
    });
  })(req, res, next);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (username, password, done) => {
      console.log("line 61");

      //get user info from database
      try {
        const userArr = await db
          .table("users")
          .where({ email_adress: username, password: password });
        let user = userArr[0];
        if (user) {
          console.log("line 68");
          done(null, user);
        } else {
          done(null, false, { message: "Incorrect username or password" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("line 73", user);
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  console.log("line 78");
  try {
    const userArr = await db.table("users").where({ user_id: id });
    let user = userArr[0];
    done(null, user);
  } catch (err) {
    console(err);
  }
});

//function to ckeck if request is authenticated
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};

//get all notes of user who log in now
router.get("/api/notes", authMiddleware, async (req, res) => {
  try {
    console.log("in 118, session is :", req.session.passport.user);
    const id = req.session.passport.user;
    const notesArr = await db
      .table("notes")
      .where({ user_id: id })
      .orderBy("update_at", "desc");
    console.log("notes are  ", notesArr);
    const data = {
      user_id: id,
      notes: notesArr
    };
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
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
  try {
    const note_id = await db
      .table("notes")
      .returning("id")
      .insert({
        title: data.title,
        body: data.body,
        update_at: data.update_at,
        user_id: data.user_id
      });
    res.json(note_id[0]);
  } catch (err) {
    console.log(err);
  }
});

//ノートを削除する
router.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  await db
    .table("notes")
    .where("id", id)
    .del();

  res.send("deleted");
});
module.exports = api;
module.exports = router;
