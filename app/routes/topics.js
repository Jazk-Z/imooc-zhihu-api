const Router = require("koa-router");
const jwt = require("koa-jwt");
const config = require("../config");
const router = new Router({ prefix: "/topics" });
const {
  find,
  findById,
  create,
  update,
  listToicsFollowers,
  checkTopicExist,
  listQuestions
} = require("../controllers/topics");
// 认证
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", findById);
router.post("/", checkTopicExist, create);
router.patch("/:id", auth, checkTopicExist, update);
router.get("/:id/followers", checkTopicExist, listToicsFollowers);
router.get("/:id/questions", checkTopicExist, listQuestions);
module.exports = router;
