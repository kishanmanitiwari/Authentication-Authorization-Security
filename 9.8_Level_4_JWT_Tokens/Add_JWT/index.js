import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import validateUser from "./middleware/validate.js";

const app = express();
const port = 3000;

// Pg-Client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "basicAuth",
  password: "kkmani2001",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const data = jwt.verify(token, "secret");
      console.log(data);
      return res.redirect("/secrets")
    } catch (error) {
      console.log(error);
    }
    
  }

  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length > 0) {
      res.send("Email already exists!");
    } else {
      const query = "INSERT INTO users(email, password) VALUES ($1, $2)";
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(query, [email, hashedPassword]);
      const token = jwt.sign({ email: email }, "secret", { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true });
      res.render("secrets.ejs");
    }
  } catch (error) {
    console.log("Error Inserting Data", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const query = "SELECT email, password FROM users WHERE email = $1";
    const { rows } = await db.query(query, [email]);

    if (rows.length < 1) {
      res.send("User doesn't exist, Please register");
    } else {
      const checkPassword = await bcrypt.compare(password, rows[0].password);

      if (checkPassword) {
        const token = jwt.sign({ email: email }, "secret", { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect("/secrets");
      } else {
        res.redirect("/login");
      }
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/secrets", validateUser, (req, res) => {
  res.render("secrets.ejs");
});

app.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
