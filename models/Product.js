const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  imgs: [{ type: String, required: true }],
  brand: { type: String, required: true },
  stock: { type: Number, required: true, default: 200 },
  rank: { type: String, required: false },
});

module.exports = mongoose.model("Product", productSchema);
