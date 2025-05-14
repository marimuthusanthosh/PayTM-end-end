const  JWT_SECRET  = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }
  } catch (err) {
    console.log("Invalid token:", token);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = {
  authMiddleware
};
