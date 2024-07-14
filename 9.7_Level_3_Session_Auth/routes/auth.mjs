import express from 'express';
import bcrypt from "bcrypt";

import bodyParser from "body-parser";

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));

  
router.get("/login", (req, res) => {
    if(req.session.user){
      return res.redirect('/secrets');
    }
    res.render("login.ejs");
  });
  
  router.get("/register", (req, res) => {
    res.render("register.ejs");
  });
  
router.post("/register", async (req, res) => {
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
        req.session.user = email;
       res.redirect('/secrets')
      }
    } catch (error) {
      console.log("Error Inserting Data", error.stack);
      res.status(500).send("Internal Server Error");
    }
  });
  
  router.post("/login", async (req, res) => {
  
    const email = req.body.username;
    const password = req.body.password;
  
    try {
      const query = "SELECT email, password FROM users WHERE email = $1";
      const { rows } = await db.query(query, [email]);
  
      if (rows.length < 1) {
        res.send("User doesn't exist, Please register");
      } else {
        const checkPassword = await bcrypt.compare(password,rows[0].password);
        if (checkPassword) {
          req.session.user = email;
          res.render('secrets.ejs')
        } else {
          res.render('login.ejs')
        }
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  export default router;
