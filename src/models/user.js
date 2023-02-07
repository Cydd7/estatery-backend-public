const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bookedProperties: [
    {
      propid: {
        type: String,
        required: true,
      },
      datesstr: {
        type: String,
        required: true,
      },
      months: {
        type: String,
        required: true,
      },
    },
  ],
  savedProperties: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
