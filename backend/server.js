require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  const { name, price, currency } = req.body; // from frontend or your API

  try {
    // 1. Create a product dynamically
    const product = await stripe.products.create({
      name: name,
    });

    // 2. Create a price for that product
    const stripePrice = await stripe.prices.create({
      unit_amount: price, // must be in cents
      currency: currency || "sgd",
      product: product.id,
    });

    // 3. Create the Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    // 4. Redirect user to Checkout
    res.redirect(303, session.url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("Running on http://localhost:4242"));
