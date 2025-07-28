const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.sendStatus(404);

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authenticateToken;
