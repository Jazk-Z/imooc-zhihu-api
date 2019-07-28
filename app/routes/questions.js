const Router = require("koa-router");
const jwt = require("koa-jwt");
const config = require("../config");
const router = new Router({ prefix: "/questions" });
const {
  find,
  findById,
  checkQuestionExist,
  checkQuestioner,
  create,
  update,
  del
} = require("../controllers/questions");
// 认证
const auth = jwt({ secret: config.secret });
router.get("/", find);
router.get("/:id", checkQuestionExist, findById);
router.post("/", auth, create);
router.patch("/:id", auth, checkQuestionExist, checkQuestioner, update);
router.delete("/:id", auth, checkQuestionExist, checkQuestioner, del);
module.exports = router;
