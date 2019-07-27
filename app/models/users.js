const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: false, default: 0 }
});

// 生成Momal
// 集合的名字
module.exports = model("User", userSchema);
