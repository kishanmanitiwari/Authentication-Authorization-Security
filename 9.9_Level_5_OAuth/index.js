import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";

import db from "./db/dbConfig.js";

const app = express();
const port = 3000;

const sessionConfig = {
  secret: process.env.SESSION_SECRET, // Replace with a strong, random secret
  resave: false,
  saveUninitialized: true,
  name: "express-sessionID", // Custom name for the session ID cookie
  cookie: {
    secure: false, // Set to 'true' in production for HTTPS
  },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

const googleConfig = {
  clientID:process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
};

const googleFunction = async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      profile.email,
    ]);
    if (result.rows.length === 0) {
      //1st time
      const newUser = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [profile.email, "google"]
      );

      done(null, newUser.rows[0]);
    }

    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
};

const myGoogleStatergy = new GoogleStrategy(googleConfig, googleFunction);

passport.use("google", myGoogleStatergy);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  // Check if Passport session data exists and extract email (if available)
  const userEmail = req.session?.passport?.user?.email;

  if (userEmail) {
    // User logged in, redirect to secrets

    return res.redirect("/secrets");
  }

  // User not logged in, render login page
   res.render("login.ejs");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.get("/secrets", (req, res) => {
  console.log(req.session);
  res.render("secrets.ejs");
});

app.post("/logout", (req, res) => {
  res.clearCookie("express-sessionID");
  req.session.destroy();
  res.redirect("/");
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
