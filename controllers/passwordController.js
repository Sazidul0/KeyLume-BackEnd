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
    const { siteName, usernameOrEmail, password } = req.body;
    try {
        const newPassword = await Password.create({
            userId: req.user.id,
            siteName,
            usernameOrEmail,
            password,
        });
        res.status(201).json(newPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    try {
        const securePassword = generateSecurePassword();
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