const User = require("../models/User");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Stripe Customer
    const customer = await stripe.customers.create({
      name,
      email,
      phone,
    });

    // Create MongoDB User
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      stripeCustomerId: customer.id, 
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        stripeCustomerId: newUser.stripeCustomerId,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
