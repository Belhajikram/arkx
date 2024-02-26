const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const escapehtml = require('escape-html');
// const Joi = require('joi');
const { body, validationResult } = require('express-validator');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));



app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send("Invalid CSRF token");
}); 

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Sample Vulnerable Node.js Application');
});

app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}"><br>
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', [
  body('username').trim().isLength(5).toLowerCase(),
  body('password').trim().isLength(8).withMessage('Password Length short, min 8 char required'),
],(req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors);
    return;
  }
  const { username, password } = req.body;
  // Authenticate user (vulnerable code for the challenge)
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    req.session.username = username;
    res.redirect('/profile');
  } else {
    res.send('Invalid username or password');
  }
 });

app.get('/profile', (req, res) => {
  if (req.session.authenticated) {
    res.send(`<h1>Welcome to your profile, ${req.session.username}</h1>`);
  } else {
    res.redirect('/login');
  }
});

// Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
