const Router = require("koa-router");
const jwt = require("koa-jwt");
const config = require("../config");
const router = new Router({
  prefix: "/questions/:questionId/answers/:answerId/comments"
});
const {
  find,
  findById,
  checkCommentator,
  checkCommentExist,
  create,
  del,
  update
} = require("../controllers/comments");
// 认证
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", checkCommentExist, findById);
router.post("/", auth, create);
router.patch("/:id", auth, checkCommentExist, checkCommentator, update);
router.delete("/:id", auth, checkCommentExist, checkCommentator, del);
module.exports = router;
