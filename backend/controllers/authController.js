const authService = require("../services/authService");
const { authenticator } = require("otplib");
const emailService = require("../services/emailService");
const User = require("../models/User");

const tempUsers = new Map(); // Replace with Redis in prod

exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  authenticator.generate = () => "1234"; 
  const otp = authenticator.generate("any_secret"); //forcing it to be always be 1234
  tempUsers.set(email, { name, email, phone, password, otp });

  try {
    await emailService.sendOtp(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP Email Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json({ message: "Login successful", ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const tempUser = tempUsers.get(email);

  if (!tempUser || tempUser.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    const user = await authService.signup({
      name: tempUser.name,
      email: tempUser.email,
      phone: tempUser.phone,
      password: tempUser.password,
    });

    tempUsers.delete(email);
    res.status(201).json({ message: "User verified and account created", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};