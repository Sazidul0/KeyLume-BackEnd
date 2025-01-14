const axios = require('axios');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Function to verify CAPTCHA response
const verifyCaptcha = async (captchaResponse) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Add your secret key in .env
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

    const response = await axios.post(verificationUrl);
    return response.data.success;
};

// User registration
const registerUser = async (req, res) => {
    const { username, email, password, captcha } = req.body;

    // Verify CAPTCHA response
    const isCaptchaValid = await verifyCaptcha(captcha);
    if (!isCaptchaValid) {
        return res.status(400).json({ message: 'Captcha verification failed' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, email, password, userType: 'free' }); // Default to 'free'
        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                userType: user.userType,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, password, captcha } = req.body;

    // Verify CAPTCHA response
    const isCaptchaValid = await verifyCaptcha(captcha);
    if (!isCaptchaValid) {
        return res.status(400).json({ message: 'Captcha verification failed' });
    }

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                userType: user.userType,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
