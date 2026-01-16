const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ROUTES
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const programRoutes = require('./routes/program.routes');
const uploadRoutes = require('./routes/upload.routes');
const dataRoutes = require('./routes/data.routes');

// APP INIT
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/data', dataRoutes);

// MONGODB CONNECTION + SERVER START
const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Mongo connected');
        app.listen(PORT, () => console.log('Server running on', PORT));
    })
    .catch(err => console.error(err));
