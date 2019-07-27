const Router = require("koa-router");
const jwt = require("koa-jwt");
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
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.patch("/:id", auth, checkAuth, update);
router.delete("/:id", auth, checkAuth, del);
router.post("/login", login);
module.exports = router;
