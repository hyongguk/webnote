const express = require("express");
const router = express.Router();
const api = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/index.js");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const flash = require("express-flash");

router.use(flash());
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

//check if user is authenticated
router.get("/api/auth", (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({ isAuthenticated: false });
  } else {
    res.json({ isAuthenticated: true });
  }
});
//sign up
router.post("/api/signup", async (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(async hash => {
    // check if user is already in the database
    let user = [];
    await db
      .table("users")
      .where({ email_adress: req.body.email })
      .then(result => {
        user = result;
      })
      .catch(err => {
        throw err;
      });
    let newUser = { email_adress: req.body.email, password: hash };
    if (user.length === 0) {
      await db
        .table("users")
        .insert(newUser)
        .then(() => {
          passport.authenticate("local", (err, user, info) => {
            if (err) {
              return next(err);
            }
            if (!user) {
              return res.status(400).send([user, "Cannot log in", info]);
            }

            req.login(user, () => {
              res.status(201).json({ isCreated: true });
            });
          })(req, res, next);
        });
    } else {
      req.flash("sorry, that username is already taken.");
      res.status(200).json({ isCreated: false });
    }
  });
});
//login by using passport
router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).send([user, "Cannot log in", info]);
    }

    req.login(user, () => {
      res.send("Logged in");
    });
  })(req, res, next);
});

//Log out api

router.get("/api/logout", (req, res) => {
  req.logOut();
  res.send("loged out");
});

//check auth using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (username, password, done) => {
      //get user info from database

      const userArr = await db.table("users").where({ email_adress: username });
      let user = userArr[0];
      if (!user) {
        done(null, false, { message: "Incorrect username or password" });
      } else {
        let userPassHash = user.password;
        const match = await bcrypt.compare(password, userPassHash);

        if (match) {
          done(null, user);
        } else {
          done(null, false, { message: "Incorrect username or password" });
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userArr = await db.table("users").where({ user_id: id });
    let user = userArr[0];
    done(null, user);
  } catch (err) {
    throw err;
  }
});

//function to ckeck if request is authenticated
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.json({ isAuthenticated: false });
  } else {
    return next();
  }
};

//get all notes of user who log in now
router.get("/api/notes", authMiddleware, async (req, res) => {
  const id = req.session.passport.user;
  const notesArr = await db
    .table("notes")
    .where({ user_id: id })
    .orderBy("update_at", "desc");

  const data = {
    user_id: id,
    notes: notesArr
  };

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
});

//delete note
router.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  await db
    .table("notes")
    .where("id", id)
    .del();

  res.send("deleted");
});

//search notes
router.get("/api/notes/search", async (req, res) => {
  const searchWord = req.query.keyword;
  const userId = req.user.user_id;
  let notes = [];
  await db
    .table("notes")
    .where({ user_id: userId })
    .where("body", "ilike", "%" + searchWord + "%")
    .orderBy("update_at", "desc")
    .then(results => {
      notes = results;
      res.json(notes);
    })
    .catch(err => {
      throw err;
    });
});

const test = require('../server/queries').getUsers
//test
router.get("/api/test", test)
module.exports = api;
module.exports = router;
