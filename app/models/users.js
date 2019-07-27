const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }
});

// 生成Momal
// 集合的名字
module.exports = model("User", userSchema);
