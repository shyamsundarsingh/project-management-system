const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    programName: { type: String, required: true, unique: true },
    programManager: String,
    programType: String,
    tableName: String,  // auto-generated
    startDate: Date,
    endDate: Date,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', programSchema);
