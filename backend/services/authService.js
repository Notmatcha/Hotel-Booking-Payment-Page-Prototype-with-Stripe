const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.signup = async ({ name, email, phone, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const customer = await stripe.customers.create({ name, email, phone });

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    stripeCustomerId: customer.id,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      stripeCustomerId: user.stripeCustomerId,
    },
  };
};
