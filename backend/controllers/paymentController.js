const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  const { amount, customerId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }
  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount ,
      currency: "sgd",
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
