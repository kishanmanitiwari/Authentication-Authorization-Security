// sessionConfig.js

const sessionConfig = {
    secret: "topSecret", // Replace with a strong, random secret
    resave: false, //Only resave when there is modification
    saveUninitialized: true, //Handles for new user also
    name: "express-sessionID", // Custom name for the session ID cookie
    cookie: {
      secure: false, // Set to 'true' in production for HTTPS
    },
  };
  
  export default sessionConfig;
  