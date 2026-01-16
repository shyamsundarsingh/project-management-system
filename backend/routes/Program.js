const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Program = require('../models/Program');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

// ----------------------
// MULTER SETUP FOR CSV
// ----------------------
const upload = multer({ dest: 'uploads/' });

// ----------------------
// CREATE PROGRAM + DYNAMIC COLLECTION
// ----------------------
router.post('/', async (req, res) => {
    try {
        const { programName, programManager, programType, startDate, endDate, status, tableName } = req.body;

        // Validate tableName uniqueness
        const exists = await Program.findOne({ tableName });
        if (exists) return res.status(400).json({ error: 'Table name already exists' });

        // Define default fields
        const fields = [
            'uniqueid', 'company_Name', 'Company_Source', 'Turnover_range', 'First_Name', 'Last_Name',
            'Full_Name', 'Official_Email', 'Mobile', 'Phone_Number', 'RegisterOn', 'Call_Remark',
            'Call_status', 'call_duration', 'calling_date', 'Calling_By'
        ];

        // Save program metadata
        const program = await Program.create({ programName, tableName, fields, programManager, programType, startDate, endDate, status });

        // Create dynamic collection (MongoDB creates automatically on first insert)
        const collection = mongoose.connection.collection(tableName);

        // Insert a placeholder doc with nulls to initialize fields
        const placeholder = {};
        fields.forEach(f => placeholder[f] = null);
        await collection.insertOne(placeholder);
        await collection.deleteMany({ uniqueid: null }); // remove placeholder

        res.json({ message: 'Program created and collection initialized', program });

    } catch (err) {
        console.error('PROGRAM CREATE ERROR:', err);
        res.status(500).json({ error: 'Failed to create program' });
    }
});

// ----------------------
// GET ALL PROGRAMS
// ----------------------
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find().sort({ createdAt: -1 });
        res.json(programs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch programs' });
    }
});

// ----------------------
// GET PROGRAM DATA BY TABLE NAME
// ----------------------
router.get('/:tableName', async (req, res) => {
    try {
        const { tableName } = req.params;
        const collection = mongoose.connection.collection(tableName);
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch program data' });
    }
});

// ----------------------
// UPLOAD CSV TO DYNAMIC COLLECTION
// ----------------------
router.post('/:tableName/upload', upload.single('file'), async (req, res) => {
    try {
        const { tableName } = req.params;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                // Map CSV row to Mongo fields
                results.push({
                    uniqueid: row.uniqueid,
                    company_Name: row.company_Name,
                    Company_Source: row.Company_Source,
                    Turnover_range: row.Turnover_range,
                    First_Name: row.First_Name,
                    Last_Name: row.Last_Name,
                    Full_Name: row.Full_Name,
                    Official_Email: row.Official_Email,
                    Mobile: row.Mobile,
                    Phone_Number: row.Phone_Number,
                    RegisterOn: row.RegisterOn,
                    Call_Remark: row.Call_Remark,
                    Call_status: row.Call_status,
                    call_duration: row.call_duration,
                    calling_date: row.calling_date,
                    Calling_By: row.Calling_By
                });
            })
            .on('end', async () => {
                if (results.length === 0) return res.status(400).json({ message: 'CSV file is empty' });

                const collection = mongoose.connection.collection(tableName);
                await collection.insertMany(results);

                fs.unlinkSync(req.file.path); // delete uploaded CSV
                res.json({ success: true, message: 'CSV uploaded successfully', count: results.length });
            });

    } catch (err) {
        console.error('CSV UPLOAD ERROR:', err);
        res.status(500).json({ message: 'CSV upload failed', error: err.message });
    }
});

module.exports = router;
