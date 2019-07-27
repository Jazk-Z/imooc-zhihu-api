const Router = require("koa-router");
const jwt = require("koa-jwt");
const config = require("../config");
const router = new Router({ prefix: "/topics" });
const { find, findById, create, update } = require("../controllers/topics");
// 认证
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.patch("/:id", auth, update);
module.exports = router;
