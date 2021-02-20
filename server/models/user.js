const mongoose = require("mongoose");
const { v4: uuid } = require('uuid');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  id: { type: String, required: true, max: 36 , default: uuid()},
  fullName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  descriptors: { type: Array},
});

module.exports = mongoose.model("user", UserSchema);
