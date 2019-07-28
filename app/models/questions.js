const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String, required: false },
  questioner: {
    type: Schema.Types.ObjectId,
    required: true,
    select: false,
    ref: "User"
  }
});

// 生成Momal
// 集合的名字
module.exports = model("Question", questionSchema);
