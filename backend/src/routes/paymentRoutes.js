const {
  processPayment,
  sendStripeApiKey,
  
} = require("../controllers/paymentController");



const router = require("express").Router();
const bodyParser = require("body-parser");
const { checkToken } = require("../middleware/tokenauthentication");

// Payment routes
router.route("/process").post(checkToken, processPayment);
router.route("/stripeapikey").get(checkToken, sendStripeApiKey);

// Stripe Webhook route (must use raw body)
// router.post(
  // "/webhook",
  // bodyParser.raw({ type: "application/json" }),
  // handleStripeWebhook
// );
// 
module.exports = router;
