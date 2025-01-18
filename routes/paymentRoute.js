const express = require('express');
const router = express.Router();
const { createPaymentIntent, upgradeUserToPro } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware'); // To ensure only authenticated users can upgrade

// Route to create a payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Route to upgrade user to Pro after successful payment
router.post('/users/upgrade', protect, upgradeUserToPro);

module.exports = router;
