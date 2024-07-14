import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// Instance
const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = "your_secret_key";  // Use a secure key stored in environment variables

// Routes
app.get("/", (req, res) => {
  const token = jwt.sign({ email: "sunny@gmail.com" }, SECRET_KEY, { expiresIn: '1h' });  // Added expiration time
  res.cookie("jwt", token);  
  res.send("JWT token sent!");
});

app.get("/read", (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).send("Token not provided!");
  }

  try {
    const data = jwt.verify(token, SECRET_KEY);
    res.json(data);
  } catch (err) {
    res.status(403).send("Invalid token!");
  }
});

// Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
