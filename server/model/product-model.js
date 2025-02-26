const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: `price must be a positive number!`,
    },
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
    required: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
