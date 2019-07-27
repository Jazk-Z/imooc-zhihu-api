const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/users");
class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find();
  }
  async findById(ctx) {
    const id = ctx.params.id;
    const user = await User.findById(id);
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
      }
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
}
module.exports = new UsersCtl();
