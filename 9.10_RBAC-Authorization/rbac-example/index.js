import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jwt-simple";
import { authenticate, authorize } from "./rbacMiddleware.mjs";

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const users = {
    'admin@example.com': { password: 'admin123', role: 'admin' },
    'user@example.com': { password: 'user123', role: 'user' }
  };

// Example login route to generate JWT token
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Mock user authentication
  const user = users[email];
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Authentication failed");
  }

  // Generate JWT token with user email (assuming simple email-based token)
  const token = jwt.encode({ email }, secret);
  res.cookie("token", token, { httpOnly: true }).send("Login successful");
});

// Example route accessible to admin only
app.get("/admin/dashboard", authenticate, authorize("admin"), (req, res) => {
  res.send("Admin Dashboard");
});

// Example route accessible to user (for their own resources)
app.get(
  "/user/profile",
  authenticate,
  authorize("user", "read_own"),
  (req, res) => {
    res.send("User Profile");
  }
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
