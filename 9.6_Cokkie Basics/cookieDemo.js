import cookieParser from "cookie-parser";
import express from "express";

//Instance
const app = express();

//Middleware
app.use(cookieParser());

//Routes

app.get("/", (req, res) => {
  //Cookie send
  res.cookie("user", "sunny");
  res.send("Cookie Sucefully Sent!");
});

//Cookie Read

app.get("/getcookie", (req, res) => {
  console.log(req.cookies);
  const username = req.cookies.user;
  if (username) {
    res.send(`Welcome back, ${username}!`);
  } else {
    res.send("No cookie found");
  }
});

//Cookie Clear
app.get("/clearCookie", (req, res) => {
  res.clearCookie("user");
  res.send("Cookie Cleared");
});

//Server
app.listen(3000, () => console.log("Server is running on port 3000"));
