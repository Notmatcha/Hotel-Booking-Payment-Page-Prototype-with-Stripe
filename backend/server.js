require("dotenv").config();

const helmet = require('helmet');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
// app.use(helmet.hsts({
//   maxAge: 31536000, // 1 year in seconds
//   includeSubDomains: true, // Applies to subdomains
//   preload: true // Allow inclusion in browser preload lists
// }));
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter); // prevent bruteforce

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
