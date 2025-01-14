// File: models/Password.js
const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    siteName: { type: String, required: true },
    usernameOrEmail: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('Password', passwordSchema);

// File: routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;