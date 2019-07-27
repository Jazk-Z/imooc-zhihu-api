const Koa = require("koa");
const bodyparser = require("koa-bodyparser");
const app = new Koa();
const routing = require("./routes");
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 捕捉不到404
    ctx.status = err.status || err.statusCode || 500;
    ctx.body = {
      message: err.message
    };
    console.log(err);
  }
});
app.use(bodyparser());
routing(app);
app.listen(3000, () => console.log("程序启动在 port : 3000"));
