const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
    required: true
  },
  headline: { type: String },
  locations: {
    type: [{ type: String }],
    select: false
  },
  business: { type: String },
  employments: {
    type: [
      {
        company: { type: String },
        job: { type: String }
      }
    ],
    select: false
  },
  educations: {
    type: [
      {
        school: { type: String },
        major: { type: String },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graducation_year: { type: Number }
      }
    ],
    select: false
  },
  //   关注
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    select: false
  }
});

// 生成Momal
// 集合的名字
module.exports = model("User", userSchema);
