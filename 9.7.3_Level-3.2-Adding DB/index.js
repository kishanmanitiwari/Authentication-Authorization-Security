import express from "express";
import bodyParser from "body-parser";
import session from 'express-session';
import sessionConfig from "./config/sessionConfig.js";
import homeRoutes from "./routes/homeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session(sessionConfig));

app.use(homeRoutes);
app.use(authRoutes);
app.use(protectedRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
