import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

//Instance
const app = express();

//Middlware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Use cookie-parser middleware
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

//Routes

app.get("/", (req, res) => {
    res.cookie('username', 'Kishan', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set');
});

app.get('/getcookie', (req, res) => {
    console.log(req.cookies);
    const username = req.cookies.username;
    if (username) {
      res.send(`Welcome back, ${username}!`);
    } else {
      res.send('No cookie found');
    }
  });

  // Clear a cookie
app.get('/clearcookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie has been cleared');
  });




  
//Server
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
