const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: String,
  roomNumber: Number,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  roomType: String
});

module.exports = mongoose.model('Booking', bookingSchema);
