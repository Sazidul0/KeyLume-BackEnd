// File: models/Password.js
const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    siteName: { type: String, required: true },
    usernameOrEmail: { type: String, required: true },
    password: { type: String, required: true },
}, { collection: 'passwords' }); // Explicitly set collection name



module.exports = mongoose.model('Password', passwordSchema);




