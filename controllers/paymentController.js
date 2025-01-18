// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key
const User = require('../models/User');

// Create Payment Intent and return client secret
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Use your secret key here

const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;  // Amount passed from the frontend (in cents, e.g., 5000 for $50)

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,  // Amount in cents
            currency: 'usd', // Currency type
        });

        // Send the clientSecret to the frontend
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentIntent };


// Update userType to 'pro' after payment
const upgradeUserToPro = async (req, res) => {
    try {
        const { paymentIntentId } = req.body; // The paymentIntent ID after successful payment

        // Verify the payment was successful
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            // Find the user who made the payment (you should identify them via JWT or user ID)
            const user = req.user; // Assuming user is already authenticated
            const updatedUser = await User.findByIdAndUpdate(user.id, { userType: 'pro' }, { new: true });

            res.json({ message: 'Account upgraded to Pro', user: updatedUser });
        } else {
            res.status(400).send({ message: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Error upgrading user to Pro:', error);
        res.status(500).send({ message: 'Error upgrading user' });
    }
};

module.exports = { createPaymentIntent, upgradeUserToPro };
