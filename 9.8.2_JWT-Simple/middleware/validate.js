import jwt from "jwt-simple";

export default function validateUser(req, res, next) {
  const token = req.cookies.token; // Use 'token' as the key to match the main code
  if (!token) {
    return res.redirect("/login");
  }

  const data = jwt.decode(token, "secret");
  if (data) {
    console.log(data);
    next();
  } else {
    let errorMessage = "Invalid token!";
    console.log(errorMessage);
    res.redirect("/login");
  }
}
