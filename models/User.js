const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: { type: String, required: false },
  email: { type: String, required: true },
  pass: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  role: { type: String, required: true },
  resetPassToken: { type: String, required: false },
});
module.exports = mongoose.model("users", UserSchema);
