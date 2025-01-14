// File: routes/passwordRoutes.js
const express = require('express');
const {
    getPasswords,
    createPassword,
    updatePassword,
    deletePassword,
    generatePassword,
    breachCheck,
    strengthCheck,
} = require('../controllers/passwordController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getPasswords).post(protect, createPassword);
router
    .route('/:id')
    .put(protect, updatePassword)
    .delete(protect, deletePassword);
router.post('/generate', protect, generatePassword);
router.post('/breach-check', protect, breachCheck);
router.post('/strength-check', protect, strengthCheck);

module.exports = router;
