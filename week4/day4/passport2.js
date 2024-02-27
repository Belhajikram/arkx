const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const Users = require("./users.json");
const { body, validationResult, cookie } = require("express-validator");
const cookieParser = require('cookie-parser')


const app = express();
const PORT = 3055;

app.use(cookieParser())
app.use(express.json());
app.use(
  session({
    secret: "Ikram23",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);
console.log('gkkgkg')
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = Users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return done(null, false, { message: "Incorrect password." });
    }
    done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = Users.find((u) => u.id === id);
  done(null, user);
});

const checkAuthentificated = (req, res, next) => {
    if (req.isAuthenticated()) {
     return next();
    }
    return res.status(401).json('can not loggin')
  }

app.post(
  "/registration",
  [
    body("username").isLength({ min: 5, max: 15 }).notEmpty().escape(),
    body("password").isLength({ min: 5, max: 15 }).notEmpty().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      id: Users.length + 1,
      username: req.body.username,
      password: hashedPassword,
    };
    if (newUser) {
      Users.push(newUser);
      await fs.writeFile("./users.json", JSON.stringify(Users));
      res.json(Users);
    }
  }
);

app.post(
  "/login",
  body("username").isLength({ min: 5, max: 15 }).notEmpty().escape(),
  body("password").isLength({ min: 5, max: 15 }).notEmpty().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  passport.authenticate("local"),
  (_, res) => {
    res.json({ message: "logged in successfully"})
  }
);

app.get("/protected", checkAuthentificated, (req, res) => {
  res.json(`Welcome ${req.user.username}`);
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/");
    });
  });
});


app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
