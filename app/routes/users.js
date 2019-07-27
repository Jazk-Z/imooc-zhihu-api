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
  checkAuth,
  listFollowing,
  follow,
  unfollow,
  listFollowers,
  checkUserExist
} = require("../controllers/users");
// 认证
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.patch("/:id", auth, checkAuth, update);
router.delete("/:id", auth, checkAuth, del);
router.post("/login", login);
router.get("/:id/following", listFollowing);
router.get("/:id/followers", listFollowers);
router.put("/following/:id", auth, checkUserExist, follow);
router.delete("/following/:id", auth, checkUserExist, unfollow);
module.exports = router;
