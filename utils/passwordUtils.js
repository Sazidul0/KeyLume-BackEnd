// File: utils/passwordUtils.js
const crypto = require('crypto');
const axios = require('axios');



// Helper function to generate a password with the given criteria
const generateSecurePassword = (length, includeNumbers, includeSymbols, includeUppercase) => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let characters = lowercaseChars;

    if (includeUppercase) {
        characters += uppercaseChars;
    }

    if (includeNumbers) {
        characters += numberChars;
    }

    if (includeSymbols) {
        characters += symbolChars;
    }

    // Generate a password of the required length
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        password += characters[randomIndex];
    }

    return password;
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
