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
      }
    });
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async update(ctx) {
    const id = ctx.params.id;
    ctx.verifyParams({
      name: {
        type: "string",
        required: true
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
}
module.exports = new UsersCtl();
