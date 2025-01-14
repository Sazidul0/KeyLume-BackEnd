// File: utils/passwordUtils.js
const crypto = require('crypto');
const axios = require('axios');

const generateSecurePassword = () => {
    return crypto.randomBytes(12).toString('hex');
};

const checkPasswordBreach = async (password) => {
    const hash = crypto.createHash('sha1').update(password).digest('hex');
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5).toUpperCase();
    const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
    return response.data.includes(suffix);
};

const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
};

module.exports = { generateSecurePassword, checkPasswordBreach, calculatePasswordStrength };
