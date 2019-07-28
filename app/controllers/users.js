const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/answers");
class UsersCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const perpage = Math.round(Math.max(per_page * 1, 1));
    const page = Math.round(Math.max(ctx.query.page * 1, 1) - 1);
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(per_page)
      .skip(page * per_page);
  }
  async findById(ctx) {
    const id = ctx.params.id;
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter(v => v)
      .map(v => " + " + v)
      .join("");
    const user = await User.findById(id)
      .select(selectFields)
      .populate(
        "following locations business employments.compoany employments.job educations.school educations.major followingTopics likingAnswers dislikingAnswers collectingAnswers"
      );
    if (!user) ctx.throw(404, "用户不存在");
    ctx.body = user;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: true
      },
      password: {
        type: "string",
        require: true
      }
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) ctx.throw(409, "用户已经存在");
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async update(ctx) {
    const id = ctx.params.id;
    ctx.verifyParams({
      name: {
        type: "string",
        required: false
      },
      password: {
        type: "string",
        require: false
      },
      avatar_url: { type: "string", require: false },
      gender: { type: "string", require: false },
      headline: { type: "string", require: false },
      locations: { type: "array", itemType: "string", require: false },
      business: { type: "string", require: false },
      employments: { type: "array", itemType: "object", require: false },
      educations: { type: "array", itemType: "object", require: false }
    });
    const user = await User.findByIdAndUpdate(id, ctx.request.body);
    if (!user) ctx.throw(404, "用户不存在");
    ctx.body = user;
  }
  async del(ctx) {
    const id = ctx.params.id;
    const user = await User.findByIdAndRemove(id);
    if (!user) ctx.throw(404, "用户不存在");
    ctx.status = 204;
  }
  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: true
      },
      password: {
        type: "string",
        required: true
      }
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) ctx.throw(401, "用户名或者密码不正确");
    const { _id, name } = user;
    const token = jwt.sign(
      {
        _id,
        name
      },
      config.secret,
      {
        expiresIn: "1d"
      }
    );
    ctx.body = { token };
  }
  async checkAuth(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) ctx.throw(404, "用户不存在");
    await next();
  }
  // 获取关注列表
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+following")
      .populate("following");
    if (!user) ctx.throw(404, "关注列表不存在");
    ctx.body = user.following;
  }
  // 关注
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    const index = me.following.map(v => v.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 获取他的粉丝
  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.body = users;
  }
  // 关注话题
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    const index = me.followingTopics
      .map(v => v.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+followingTopics")
      .populate("followingTopics");
    if (!user) ctx.throw(404, "话题列表不存在");
    ctx.body = user.followingTopics;
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id });
    ctx.body = questions;
  }
  // 攒
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+likingAnswers")
      .populate("likingAnswers");
    if (!user) ctx.throw(404, "用户不存在");
    ctx.body = user.likingAnswers;
  }
  async likeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select("+likingAnswers");
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } });
    }
    ctx.status = 204;
    await next();
  }
  async unlikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+likingAnswers");
    const index = me.likingAnswers
      .map(v => v.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: { voteCount: -1 }
      });
    }
    ctx.status = 204;
  }
  // 踩
  async listDislikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+dislikingAnswers")
      .populate("dislikingAnswers");
    if (!user) ctx.throw(404, "用户不存在");
    ctx.body = user.dislikingAnswers;
  }
  async dislikeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select(
      "+dislikingAnswers"
    );
    if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  async undislikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+dislikingAnswers"
    );
    const index = me.dislikingAnswers
      .map(v => v.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 收藏
  async listCollectingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+collectingAnswers")
      .populate("collectingAnswers");
    if (!user) ctx.throw(404, "用户不存在");
    ctx.body = user.collectingAnswers;
  }
  async collectAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select(
      "+collectingAnswers"
    );
    if (
      !me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)
    ) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  async uncollectAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+collectingAnswers"
    );
    const index = me.collectingAnswers
      .map(v => v.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}
module.exports = new UsersCtl();
