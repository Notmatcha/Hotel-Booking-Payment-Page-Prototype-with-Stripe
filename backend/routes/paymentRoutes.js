const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticateToken = require('../middleware/authMiddleware');

router.post("/create-payment-intent", authenticateToken, paymentController.createPaymentIntent);

module.exports = router;
