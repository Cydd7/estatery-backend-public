const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pricestr: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bed: {
    type: Number,
    required: true,
  },
  bath: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  booked: {
    type: Boolean,
    required: true,
  },
  datesstr: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("properties", propertySchema);
