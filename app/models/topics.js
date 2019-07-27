const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar_url: { type: String, required: false },
  introduction: { type: String, required: false, select: false }
});

// 生成Momal
// 集合的名字
module.exports = model("Topic", topicSchema);
