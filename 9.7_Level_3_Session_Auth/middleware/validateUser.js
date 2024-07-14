function validateUser(req, res, next) {
    const userEmail = req.session.user;
  
    if (userEmail) {
      next();
    } else {
      res.redirect('/login');
    }
  }
  
  export default validateUser;
  