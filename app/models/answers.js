const mongoose = require("mongoose");

const { Schema, model } = mongoose;
// 答案   一（问题）对多 （答案） 关系
const answerSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  answerer: {
    type: Schema.Types.ObjectId,
    required: true,
    select: false,
    ref: "User"
  },
  // 话题
  questionId: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    required: true,
    default: 0
  }
});

// 生成Momal
// 集合的名字
module.exports = model("Answer", answerSchema);
