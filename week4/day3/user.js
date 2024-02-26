const express = require('express');
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const Users = require("./users.json");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const store = new session.MemoryStore();


const app = express();
const PORT = 3022;

app.use(express.json());
app.use(session({
  secret: "Ikram23",
  cookie: { maxAge: 3000 },
  resave: false,
  saveUninitialized: false,
  store
}));

const isAuthenticated = (req, res, next) => {
  console.log(req.session.user);
  if(!req.session.user){
    res.status(400).json(" Unauthorized ");
    return;
  } 
  next();
}

app.post("/registration", [
    body("username").isLength({ min: 5, max: 15 }).notEmpty().escape(),
    body("password").isLength({ min: 5, max: 15 }).notEmpty().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = { id: Users.length + 1, username: req.body.username, password: hashedPassword };
    if (newUser) {
        Users.push(newUser);
        await fs.writeFile('./users.json', JSON.stringify(Users));
        res.json(Users);
    }
});

app.post('/login', [
    body("username").isLength({ min: 5, max: 15 }).notEmpty().escape(),
    body("password").isLength({ min: 5, max: 15 }).notEmpty().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const user = Users.find((u) => u.username === req.body.username);
    if (!user) {
        return res.status(400).json('Username is wrong');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json('Password is wrong');
    }

    req.session.user = { 
      userID: user.id,
      username: user.username };
    res.json('Successful login');
});


app.get('/protected', isAuthenticated, (req, res) => {
    res.json(`Welcome ${req.session.user.username}`);
});

app.get("/logout",(req,res)=>{
  res.clearCookie('connect.id');
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json('Logged out successfully');
  });
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
}); 
















