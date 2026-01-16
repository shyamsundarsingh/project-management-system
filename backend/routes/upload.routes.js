const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/:tableName', upload.single('file'), async (req, res) => {
    const results = [];
    const tableName = req.params.tableName;

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', data => results.push({ rowData: data }))
        .on('end', async () => {
            await mongoose.connection.collection(tableName).insertMany(results);
            fs.unlinkSync(req.file.path);
            res.json({ message: 'CSV uploaded successfully' });
        });
});

module.exports = router;
