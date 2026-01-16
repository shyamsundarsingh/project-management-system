const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { Parser } = require('json2csv');

// get all users (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// export CSV (protected)
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const fields = ['_id','name','email','createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(users);
    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    return res.send(csv);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
