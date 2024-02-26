const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const { body, validationResult } = require("express-validator");
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(csurf({ cookie: true }));

function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Unauthenticated");
    }
    const user = jwt.verify(token, "your-secret-key");
    if (!user) {
      throw new Error("Unauthenticated");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
}

app.get('/', (req, res) =>{
  return res.render("index", { csrf: req.csrfToken(), error: "Invalid username or password" });
})

app.post(
  "/login",
  [
    body("username").notEmpty().isLength({ min: 5 }).trim().escape(),
    body("password").notEmpty().isLength({ min: 8 }).trim().escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index", { csrf: req.csrfToken(), error: "Invalid username or password" });
    }
    const { username, password } = req.body;

    if (username === "admin" && password === "password") {
      const token = jwt.sign({ username: username }, "your-secret-key");
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } else {
      res.render("index", { csrf: req.csrfToken(), error: "Invalid username or password" });
    }
  }
);


app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

app.get('/logout', (req, res)=>{
  res.cookie('token', '', {httpOnly: true})
  res.redirect('/')
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
