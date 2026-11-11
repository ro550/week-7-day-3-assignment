import jwt from "jsonwebtoken";
import "dotenv/config";

function authenticateToken(req, res, next) {
  // Get the Authorization header from the request.
  const authHeader = req.headers.authorization;

  // Extract the token after the word "Bearer".
  const token = authHeader && authHeader.split(" ")[1];

  // Check whether a token was provided.
  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token using the secret key.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request.
    req.user = decoded;

    // Allow the request to continue to the route.
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      error: "Invalid token.",
    });
  }
}

export default authenticateToken;