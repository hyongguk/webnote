import {Request, Response, NextFunction} from 'express'
import Note from '../models/interfaces/note.interface'
const express = require("express");
const router = express.Router();
const api = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/index.js");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const getUsers = require('../server/queries')
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
router.get("/api/auth", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.json({ isAuthenticated: false });
  } else {
    res.json({ isAuthenticated: true });
  }
});
//sign up
router.post("/api/signup", async (req:Request, res: Response, next: NextFunction) => {
  console.log("got request")
  bcrypt.hash(req.body.password, 10).then(async (hash:string) => {
    // check if user is already in the database
    let user = [];
    await db
      .table("users")
      .where({ email_adress: req.body.email })
      .then( (result:string[]) => {
        user = result;
        console.log("user :",user)
      })
      .catch((err: Error) => {
        console.log(err);
      });
    let newUser = { email_adress: req.body.email, password: hash };
    if (user.length === 0) {
      console.log("come in if user doesn't exist in database")
      await db
        .table("users")
        .insert(newUser)
        .then(() => {
          passport.authenticate("local", (err:Error, user: any, info: any) => {
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

      res.status(400).json({ isCreated: false, error:"this username is already taken" });
    }
  });
});


//login by using passport
router.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: any, info: any ) => {
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

router.get("/api/logout", (req: Request, res: Response) => {
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
    async (username: string, password: string, done: any ) => {
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

passport.serializeUser((user: any, done: any) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const userArr = await db.table("users").where({ user_id: id });
    let user = userArr[0];
    done(null, user);
  } catch (err) {
    console.log(err);
  }
});

//function to ckeck if request is authenticated
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.json({ isAuthenticated: false });
  } else {
    return next();
  }
};

//get all notes of user who log in now
router.get("/api/notes", authMiddleware, async (req: any, res: Response) => {
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
router.put("/api/notes/:id", async (req: Request, res: Response) => {
  const note_id = req.params.id;
  await db
    .table("notes")
    .where({ id: note_id })
    .update({
      title: req.body.title,
      body: req.body.body,
      update_at: req.body.update_at
    });
  res.send("notes are updated");
});

//post new note in notes
router.post("/api/notes/", async (req: Request, res: Response) => {
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
router.delete("/api/notes/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  await db
    .table("notes")
    .where("id", id)
    .del();

  res.send("deleted");
});

//search notes
router.get("/api/notes/search", async (req: Request, res: Response) => {
  const searchWord = req.query.keyword;
  console.log("searchWord : ", searchWord)
  const userId = req.body.user.user_id
  let notes: Note[] = [];
  await db
    .table("notes")
    .where({ user_id: userId })
    .where("body", "ilike", "%" + searchWord + "%")
    .orderBy("update_at", "desc")
    .then((results: Note[]) => {
      notes = results;
      res.json(notes);
    })
    .catch((err: Error) => {
      console.log(err);
    });
});

module.exports = api;
module.exports = router;
