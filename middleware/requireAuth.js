const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }


  console.log("Raw authorization header:", authorization);

  
  const parts = authorization.split(" ");
  console.log("Authorization split into parts:", parts);

 
  console.log("First part (expected 'Bearer'):", parts[0]);
  console.log("Second part (the token):", parts[1]);

  const token = parts[1];

  try {
 
    const { _id } = jwt.verify(token, process.env.SECRET);
    console.log("Decoded JWT payload:", { _id });

    
    req.user = await User.findOne({ _id }).select("_id");
    console.log("User found and attached to request:", req.user);

   
    next();
  } catch (error) {
    console.log("JWT verification failed:", error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;