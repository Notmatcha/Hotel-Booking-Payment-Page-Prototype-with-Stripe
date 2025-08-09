require("dotenv").config();

const helmet = require('helmet');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const profRoutes = require('./routes/profRoutes');

const app = express();
// app.use(helmet.hsts({
//   maxAge: 31536000, 
//   includeSubDomains: true, 
//   preload: true 
// }));
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter); // prevent bruteforce

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many payment requests. Try again later."
});
app.use("/api/payments", paymentLimiter);

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many profile requests'
});
app.use('/api/profile', profileLimiter);

app.use(cors({
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true
}));



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
app.use('/api/profile', profRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
