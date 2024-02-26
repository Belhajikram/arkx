const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const { body, validationResult } = require("express-validator");
const app = express();

// Middleware
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

app.get("/", (req, res) => {
  res.render("index", { csrf: req.csrfToken() });
});

app.post(
  "/login",
  [
    body("username").notEmpty().isLength({ min: 5 }).trim().escape(),
    body("password").notEmpty().isLength({ min: 8 }).trim().escape(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.render("index", { csrf: req.csrfToken() });
    }
    const { username, password } = req.body;
    //
    if (username === "admin" && password === "password") {
      req.session.isAuthenticated = true;
      res.redirect("/dashboard");
    } else {
      return res.render('/');
    }
  }
);

app.get("/dashboard", (req, res) => {
  // Secure the dashboard route to only allow authenticated users
  if (req.session.isAuthenticated) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
