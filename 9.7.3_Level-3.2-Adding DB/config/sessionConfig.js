import session from "express-session";
import pgSession from "connect-pg-simple";
import db from "../db/dbConfig.js";

const PgSession = pgSession(session);

export default {
  store: new PgSession({
    pool: db,
    createTableIfMissing: true, // Enable table creation if missing
  }),
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,// Set secure to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // Expire (milisec) in a day
  }, 
};
