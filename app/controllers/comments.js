const Comment = require("../models/comments");
class CommentCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const perpage = Math.round(Math.max(per_page * 1, 1));
    const page = Math.round(Math.max(ctx.query.page * 1, 1) - 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Comment.find({
      content: q,
      questionId: ctx.params.questionId,
      answerId: ctx.params.answerId,
      rootCommentId: ctx.query.rootCommentId
    })
      .limit(perpage)
      .skip(page * perpage)
      .populate("commentator replyTo");
  }
  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter(f => f)
      .map(v => " +" + v)
      .join("");
    const comment = await Comment.findById(ctx.params.id)
      .select(selectFields)
      .populate("commentator replyTo");
    ctx.body = comment;
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
      rootCommentId: { type: "string", required: false },
      replyTo: { type: "string", required: false }
    });
    const comment = await new Comment({
      ...ctx.request.body,
      commentator: ctx.state.user._id,
      questionId: ctx.params.questionId,
      answerId: ctx.params.answerId
    }).save();
    ctx.body = comment;
  }
  async update(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true }
    });
    const { content } = ctx.request.body;
    await ctx.state.comment.update({ content });
    ctx.body = ctx.state.comment;
  }
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select(
      "+commentator"
    );
    if (!comment) ctx.throw(404, "评论不存在");
    // 只有删改查答案才检查此逻辑  攒和踩答案不检查
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId)
      ctx.throw(404, "该问题下没有此评论");
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId)
      ctx.throw(404, "该答案下没有此评论");
    ctx.state.comment = comment;
    await next();
  }
  async del(ctx) {
    await Comment.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
  async checkCommentator(ctx, next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id)
      ctx.throw(403, "没有权限");
    await next();
  }
  // 展示二级评论
}
module.exports = new CommentCtl();
