const db = [{ name: "zzy" }];
class UsersCtl {
  find(ctx) {
    ctx.body = db;
  }
  findById(ctx) {
    const id = ctx.params.id;
    if (id >= db.length) {
      ctx.throw(412, "先决条件失败");
    }
    ctx.body = db[parseInt(id, 10)];
  }
  create(ctx) {
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
  }
  update(ctx) {
    const id = ctx.params.id;
    db[id] = ctx.request.body;
    ctx.body = ctx.request.body;
  }
  del(ctx) {
    const id = ctx.params.id;
    db.splice(id, 1);
    ctx.status = 204;
  }
}
module.exports = new UsersCtl();
