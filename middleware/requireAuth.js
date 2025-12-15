const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // 1️⃣ Get the Authorization header
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("No authorization header provided");
    return res.status(401).json({ error: "Authorization token required" });
  }

  console.log("Authorization header:", authorization);

  // 2️⃣ Split header into scheme and token
  const [scheme, token] = authorization.split(" ");
  console.log("Scheme:", scheme);
  console.log("Token:", token);

  if (scheme !== "Bearer" || !token) {
    console.log("Invalid authorization format");
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  try {
    // 3️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("Decoded token payload:", decoded);

    // 4️⃣ Fetch the user from DB by ID and attach to request
    // This line finds the user in MongoDB using the ID from the token
    // and attaches only the _id field to req.user so protected routes know
    // who is making the request.
    req.user = await User.findById(decoded._id).select("_id");
    console.log("req.user attached to request:", req.user);

    if (!req.user) {
      console.log("User not found for token ID:", decoded._id);
      return res.status(401).json({ error: "User not found" });
    }

    // 5️⃣ Continue to next middleware or route
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
