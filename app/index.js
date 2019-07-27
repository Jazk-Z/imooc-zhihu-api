const Koa = require("koa");
const bodyparser = require("koa-bodyparser");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const config = require("./config");
const app = new Koa();
const routing = require("./routes");
mongoose.connect(config.connectionStr, { useNewUrlParser: true }, () =>
  console.log("mongoDB successful")
);
mongoose.connection.on("error", console.error);
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest }
  })
);
app.use(bodyparser());
app.use(parameter(app));
routing(app);
app.listen(3000, () => console.log("程序启动在 port : 3000"));
