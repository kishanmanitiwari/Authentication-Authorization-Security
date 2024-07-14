import express from "express";
import validateUser from "../middleware/validateUser.js";

const router = express.Router();

router.get('/secrets', validateUser, (req, res) => {
  res.render('secrets.ejs');
});

export default router;
