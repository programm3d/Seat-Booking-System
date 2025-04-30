const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: "Forbidden" });
      }
      req.userId = decoded.userId;
      next();
    });
  };
};

module.exports = authMiddleware;
