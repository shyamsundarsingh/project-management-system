// routes/program.routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Program = require('../models/Program'); // Program metadata model

// Configure Multer for CSV uploads
const upload = multer({ dest: 'uploads/' });

// ------------------------------
// CREATE NEW PROGRAM + DYNAMIC COLLECTION
// ------------------------------
router.post('/', async (req, res) => {
    try {
        const {
            programName,
            programManager,
            programType,
            startDate,
            endDate,
            status,
            tableName
        } = req.body;

        // Check if tableName already exists
        const exists = await Program.findOne({ tableName });
        if (exists) return res.status(400).json({ error: 'Table name already exists' });

        // Default fields for program collections
        const fields = [
            'uniqueid', 'company_Name', 'company_Source', 'Turnover_range', 'First_Name', 'Last_Name',
            'Full_Name', 'Official_Email', 'Mobile', 'Phone_Number', 'RegisterOn', 'Call_Remark',
            'Call_status', 'call_duration', 'calling_date', 'Calling_By'
        ];

        // Save program metadata
        const program = await Program.create({
            programName,
            tableName,
            fields,
            programManager,
            programType,
            startDate,
            endDate,
            status
        });

        // Create dynamic collection with placeholder doc
        const collection = mongoose.connection.collection(tableName);
        const placeholder = {};
        fields.forEach(f => placeholder[f] = null);
        await collection.insertOne(placeholder);
        await collection.deleteMany({ uniqueid: null }); // remove placeholder

        res.json({
            message: 'Program created and collection initialized',
            program
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create program' });
    }
});

// ------------------------------
// GET ALL PROGRAMS (for Program List)
// ------------------------------
router.get('/', async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;

        const query = search
            ? { programName: { $regex: search, $options: 'i' } }
            : {};

        const total = await Program.countDocuments(query);
        const programs = await Program.find(query)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ startDate: -1 }); // optional: newest first

        res.json({ data: programs, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch programs' });
    }
});

// ------------------------------
// GET PROGRAM DATA WITH SEARCH & PAGINATION
// ------------------------------
router.get('/:tableName', async (req, res) => {
    try {
        const { tableName } = req.params;
        const { search = '', page = 1, limit = 10 } = req.query;

        const collection = mongoose.connection.collection(tableName);

        // Simple text search across all fields
        const sampleDoc = await collection.findOne() || {};
        const query = search
            ? { $or: Object.keys(sampleDoc).map(k => ({ [k]: { $regex: search, $options: 'i' } })) }
            : {};

        const total = await collection.countDocuments(query);
        const data = await collection.find(query)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .toArray();

        res.json({ data, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch program data' });
    }
});

// ------------------------------
// CSV UPLOAD FOR PROGRAM
// ------------------------------
router.post('/:tableName/upload', upload.single('file'), async (req, res) => {
    const { tableName } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const collection = mongoose.connection.collection(tableName);
                if (results.length === 0) return res.status(400).json({ error: 'CSV is empty' });

                // Optional: validate CSV keys match collection fields
                const firstDoc = await collection.findOne();
                const allowedKeys = firstDoc ? Object.keys(firstDoc) : Object.keys(results[0]);
                const validData = results.map(row => {
                    const filtered = {};
                    allowedKeys.forEach(k => filtered[k] = row[k] || null);
                    return filtered;
                });

                await collection.insertMany(validData);

                fs.unlinkSync(req.file.path); // delete temp file
                res.json({ message: 'CSV uploaded successfully', inserted: validData.length });
            } catch (err) {
                console.error(err);
                fs.unlinkSync(req.file.path);
                res.status(500).json({ error: 'CSV upload failed' });
            }
        });
});

module.exports = router;
