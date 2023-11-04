const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));

const users = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
      return res.status(400).send("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      username: username,
      password: hashedPassword,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);

  if (user == null) {
    return res.status(401).send("Login failed. Invalid username.");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user.id;
      return res.redirect("/secured");
    } else {
      return res.status(401).send("Login failed. Invalid password.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

app.get("/secured", (req, res) => {
  if (req.session.userId == null) {
    return res.redirect("/login");
  }
  res.send("This is a secured page.");
});

app.listen(3000)

// By Jaswanth Tikkireddy
// jaswanth.t07@gmail.com