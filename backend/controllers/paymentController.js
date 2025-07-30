const paymentService = require("../services/paymentService");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, customerId } = req.body;
    const clientSecret = await paymentService.createPaymentIntent({ amount, customerId });
    res.send({ clientSecret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
