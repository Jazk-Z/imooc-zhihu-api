const Question = require("../models/questions");
class QuestionCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const perpage = Math.round(Math.max(per_page * 1, 1));
    const page = Math.round(Math.max(ctx.query.page * 1, 1) - 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Question.find({ $or: [{ title: q, description: q }] })
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
    const question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate("questioner topics");
    ctx.body = question;
  }
  async create(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false }
    });
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save();
    ctx.body = question;
  }
  async update(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false }
    });
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select(
      "+questioner"
    );
    if (!question) ctx.throw(404, "问题不存在");
    ctx.state.question = question;
    await next();
  }
  async del(ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id)
      ctx.throw(403, "没有权限");
    await next();
  }
}
module.exports = new QuestionCtl();
