const mongoose = require("mongoose"),
  timestamp = require("mongoose-timestamp");

// trim gets rid of whitespace
const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  }
});

// use timestamp to show when customer was created/updated
CustomerSchema.plugin(timestamp);

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
