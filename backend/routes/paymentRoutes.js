const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateUser } = require('../middleware/auth');

router.post("/create-payment-intent", authenticateUser, paymentController.createPaymentIntent);

module.exports = router;
