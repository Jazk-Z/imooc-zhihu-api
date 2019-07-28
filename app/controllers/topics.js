const Topic = require("../models/topics");
const User = require("../models/users");
const Question = require("../models/questions");
class TopicCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const perpage = Math.round(Math.max(per_page * 1, 1));
    const page = Math.round(Math.max(ctx.query.page * 1, 1) - 1);
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
      .limit(perpage)
      .skip(page * perpage);
  }
  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter(f => f)
      .map(v => " +" + v)
      .join("");
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    ctx.body = topic;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introuction: { type: "string", required: false }
    });
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      introuction: { type: "string", required: false }
    });
    const topic = await Topic.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }
  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) ctx.throw(404, "话题不存在");
    await next();
  }
  async listToicsFollowers(ctx) {
    const topics = await User.find({ followingTopics: ctx.params.id });
    ctx.body = topics;
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id });
    ctx.body = questions;
  }
}
module.exports = new TopicCtl();
