import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

//Pg-Client
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

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length > 0) {
      res.send("Email already exits!");
    } else {
      const query = "INSERT INTO users(email,password) VALUES ($1,$2)";
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(query, [email, hashedPassword]);
      console.log(result);

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
      const checkPassword = await bcrypt.compare(password,rows[0].password);
      checkPassword === true
        ? res.render("secrets.ejs")
        : res.send("Incorrect username or password");
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
