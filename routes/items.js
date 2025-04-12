const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// POST a new item
router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
    manufacturer: req.body.manufacturer,
    releaseDate: req.body.releaseDate,
    isAvailable: req.body.isAvailable
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an item by ID
router.delete('/:id', getItem, async (req, res) => {
  try {
    await res.item.deleteOne(); // or res.item.remove() if using older Mongoose
    res.json({ message: 'Deleted Item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get item by ID
async function getItem(req, res, next) {
  let item;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next();
}

module.exports = router;
