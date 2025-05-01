const jwt = require("jsonwebtoken");

const authMiddleware = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

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
