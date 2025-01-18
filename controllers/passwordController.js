// File: controllers/passwordController.js
const Password = require('../models/Password');
const { generateSecurePassword, checkPasswordBreach, calculatePasswordStrength } = require('../utils/passwordUtils');

const getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.user.id });
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPassword = async (req, res) => {
    // console.log("Received request to create password"); // Log when the function is called
    const { siteName, usernameOrEmail, password } = req.body;

    // console.log("Request body:", req.body); // Log the request body

    try {
        const newPassword = await Password.create({
            userId: req.user._id,
            siteName,
            usernameOrEmail,
            password,
        });
        res.status(201).json(newPassword);
        // console.log("New password created:", newPassword); // Log the created password

    } catch (error) {
        res.status(500).json({ message: error.message });
        // console.error("Error creating password:", error); // Log the error
        // console.log(req.user._id);
        // console.log('Password model:', password);
        // console.log('Type of Password.create:', typeof password.create);

    }
};

const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { siteName, usernameOrEmail, password } = req.body;
    try {
        const updatedPassword = await Password.findByIdAndUpdate(
            id,
            { siteName, usernameOrEmail, password },
            { new: true }
        );
        res.json(updatedPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePassword = async (req, res) => {
    const { id } = req.params;
    try {
        await Password.findByIdAndDelete(id);
        res.json({ message: 'Password deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generatePassword = async (req, res) => {
    const { length, includeNumbers, includeSymbols, includeUppercase } = req.body;

    try {
        const securePassword = generateSecurePassword(length, includeNumbers, includeSymbols, includeUppercase);
        res.json({ password: securePassword });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const breachCheck = async (req, res) => {
    if (req.user.userType !== 'pro') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const { password } = req.body;
        const isBreached = await checkPasswordBreach(password);
        res.json({ breached: isBreached });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const strengthCheck = async (req, res) => {
    if (req.user.userType !== 'pro') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const { password } = req.body;
        const strength = calculatePasswordStrength(password);
        res.json({ strength });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPasswords,
    createPassword,
    updatePassword,
    deletePassword,
    generatePassword,
    breachCheck,
    strengthCheck,
};