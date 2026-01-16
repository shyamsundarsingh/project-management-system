const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const mongoose = require('mongoose');

const fixedFields = [
    "uniuqid", "company_name", "company_source", "city", "state", "country", "region",
    "phone", "website", "officialemail", "turn_over", "firstname", "lastname", "fullname",
    "designation", "job_level", "email", "mobile", "telecalling_by", "telecalling_date",
    "call_remark", "registration_status"
];

// Get all rows for program
router.get('/:tableName', async (req, res) => {
    const data = await mongoose.connection.collection(req.params.tableName).find({}).toArray();
    res.json(data);
});

// Insert single row
router.post('/:tableName', async (req, res) => {
    const row = {};
    fixedFields.forEach(f => row[f] = req.body[f] || '');
    await mongoose.connection.collection(req.params.tableName).insertOne({ rowData: row, createdAt: new Date() });
    res.json({ message: 'Row added' });
});

// CSV Upload
const upload = multer({ dest: 'uploads/' });
router.post('/upload/:tableName', upload.single('file'), async (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            const row = {};
            fixedFields.forEach(f => row[f] = data[f] || '');
            results.push({ rowData: row, createdAt: new Date() });
        })
        .on('end', async () => {
            await mongoose.connection.collection(req.params.tableName).insertMany(results);
            fs.unlinkSync(req.file.path);
            res.json({ message: 'CSV uploaded' });
        });
});

module.exports = router;
