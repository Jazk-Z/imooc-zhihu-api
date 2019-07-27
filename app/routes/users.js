const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const config = require("../config");
const router = new Router({ prefix: "/users" });
const {
  find,
  findById,
  create,
  update,
  del,
  login,
  checkAuth
} = require("../controllers/users");
// 认证
const auth = async (ctx, next) => {
  const { authorization = "" } = ctx.request.header;
  const token = authorization.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, config.secret);
    ctx.state.user = user;
  } catch (error) {
    ctx.throw(401, error.message);
  }
  await next();
};
router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.patch("/:id", auth, checkAuth, update);
router.delete("/:id", auth, checkAuth, del);
router.post("/login", login);
module.exports = router;
