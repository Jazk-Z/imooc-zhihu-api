const Router = require("koa-router");
const jwt = require("koa-jwt");
const config = require("../config");
const router = new Router({ prefix: "/questions/:questionId/answers" });
const {
  find,
  findById,
  checkAnswerExist,
  checkAnswerer,
  create,
  del,
  update
} = require("../controllers/answers");
// 认证
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", checkAnswerExist, findById);
router.post("/", auth, create);
router.patch("/:id", auth, checkAnswerExist, checkAnswerer, update);
router.delete("/:id", auth, checkAnswerExist, checkAnswerer, del);
module.exports = router;
