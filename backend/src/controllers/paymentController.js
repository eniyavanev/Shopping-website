// backend/controller/paymentController.js

const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const Stripe = require("stripe");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc   Create Stripe Payment Intent
 */
const processPayment = asyncHandler(async (req, res) => {
  const { amount, shipping } = req.body;

  // Validate amount
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "inr",
    description: "Software development services",
    shipping,
    metadata: {
      userId: req.user.id,
      notes: "Initiated from frontend payment form",
    },
    automatic_payment_methods: {
      enabled: true,
    },
    receipt_email: req.user?.email, // optional
  });

  // Return client secret with camelCase key for frontend use
  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * @desc   Send Stripe API key to frontend
 */
const sendStripeApiKey = asyncHandler(async (req, res) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

/**
 * @desc   Handle Stripe Webhook Events
 */
// const handleStripeWebhook = (req, res) => {
// const sig = req.headers["stripe-signature"];
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//
// let event;
//
// try {
// event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
// } catch (err) {
// console.error("❌ Webhook Error:", err.message);
// return res.status(400).send(`Webhook Error: ${err.message}`);
// }
//
//  Stripe event handling
// switch (event.type) {
// case "payment_intent.succeeded":
// const paymentIntent = event.data.object;
// console.log("✅ Payment Success:", paymentIntent.id);
// DB update or email logic here
// break;
//
// case "payment_intent.payment_failed":
// const failedIntent = event.data.object;
// console.log("❌ Payment Failed:", failedIntent.id);
// break;
//
// default:
// console.log(`🔔 Unhandled event type: ${event.type}`);
// }
//
// res.json({ received: true });
// };

module.exports = {
  processPayment,
  sendStripeApiKey,
};
