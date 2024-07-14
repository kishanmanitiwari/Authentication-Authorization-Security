import express from 'express';
const app = express();


const router = express.Router();


router.get('/secrets',validateUser,(req,res)=>{
    //protected 
    res.render('secrets.ejs');
  })

  router.post('/logout',(req,res)=>{
    //Delete corresponding user session from in-store
    req.session.destroy(); // Destroy session on logout
  
    res.redirect('/');
  })
  

  export default router;
