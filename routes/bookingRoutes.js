const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Create
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json(booking);
});

// Read all
router.get('/', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// Read single by ID (NEW)
router.get('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

// Update
router.put('/:id', async (req, res) => {
  const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
