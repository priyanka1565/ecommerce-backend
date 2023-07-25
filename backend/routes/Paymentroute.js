const express = require("express");

const router = express.Router();

const { isuserAuth } = require("../midddleware/auth");

const { processPayment, sendStripeApiKey } = require("../controllers/Paymentcontroller");

router.route("/payment/process").post(isuserAuth, processPayment);

router.route("/stripeapikey").get(isuserAuth, sendStripeApiKey);

module.exports = router;