const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, required: true, default: "Picking" },
  stripeSessionId: { type: String, required: false },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quan: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: false },
  orderDate: { type: Date, required: false },
  paymentDate: { type: Date, required: false },
});

module.exports = mongoose.model("Cart", cartSchema);
