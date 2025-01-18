// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const paymentRoutes = require('./routes/paymentRoute'); // Correct path

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/payment', paymentRoutes); // Now using the correct route for payment

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
