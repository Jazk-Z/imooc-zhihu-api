const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/users");
class UsersCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const perpage = Math.round(Math.max(per_page * 1, 1));
    const page = Math.round(Math.max(ctx.query.page * 1, 1) - 1);
    ctx.body = await User.find()
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
    const user = await User.findById(id).select("");
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
    if (!user) ctx.throw(404);
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
}
module.exports = new UsersCtl();
