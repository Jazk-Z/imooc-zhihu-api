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
  checkUserExist,
  followTopic,
  unfollowTopic,
  listFollowingTopics,
  listQuestions,
  likeAnswer,
  listDislikingAnswers,
  listLikingAnswers,
  dislikeAnswer,
  undislikeAnswer,
  unlikeAnswer,
  listCollectingAnswers,
  collectAnswer,
  uncollectAnswer
} = require("../controllers/users");
const { checkTopicExist } = require("../controllers/topics");
const { checkAnswerExist } = require("../controllers/answers");
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
router.put("/following_topics/:id", auth, checkTopicExist, followTopic);
router.delete("/following_topics/:id", auth, checkTopicExist, unfollowTopic);
router.get("/:id/followers_topics", listFollowingTopics);
router.get("/:id/questions", listQuestions);
// 赞 踩
router.put(
  "/liking_answers/:id",
  auth,
  checkAnswerExist,
  likeAnswer,
  undislikeAnswer
);
router.delete("/liking_answers/:id", auth, checkAnswerExist, unlikeAnswer);
router.get("/:id/liking_answers", listLikingAnswers);

router.put(
  "/disliking_answers/:id",
  auth,
  checkAnswerExist,
  dislikeAnswer,
  unlikeAnswer
);
router.delete(
  "/disliking_answers/:id",
  auth,
  checkAnswerExist,
  undislikeAnswer
);
router.get("/:id/disliking_answers", listDislikingAnswers);

router.put("/collecting_answers/:id", auth, checkAnswerExist, collectAnswer);
router.delete(
  "/collecting_answers/:id",
  auth,
  checkAnswerExist,
  uncollectAnswer
);
router.get("/:id/collecting_answers", listCollectingAnswers);
module.exports = router;
