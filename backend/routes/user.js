const express = require('express');
const router = express.Router();
const User = require('../models/userser'); // model Mongoose

// GET tất cả user
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST tạo user mới
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    
    user.name = req.body.name;
    user.email = req.body.email;
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    
    await user.deleteOne();
    res.json({ message: 'Đã xóa user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
