const { Router } = require('express');
const { signUp, logIn, logOut, 
  loadMyInfo, loadUser, changeUsername, 
  loadFollowings, follow, unfollow, 
  loadFollowers, removeFollower } = require("../controllers/user");
const { loadPostsByUser } = require("../controllers/posts");
const { isLoggedIn, isNotLoggedIn } = require("../controllers/middlewares");

const router = Router();

router.post("/", isNotLoggedIn, signUp);
router.post("/login", isNotLoggedIn, logIn);
router.post("/logout", isLoggedIn, logOut);

router.patch("/profile", isLoggedIn, changeUsername); 

router.get("/followings", isLoggedIn, loadFollowings); // 내가 팔로우 하는 사람들 목록 불러오기 
router.put("/following/:userId", isLoggedIn, follow); // 팔로우 하기 or 나의 팔로워를 팔로우 하기
router.delete("/following/:userId", isLoggedIn, unfollow); // 팔로우 취소하기

router.get("/followers", isLoggedIn, loadFollowers); // 나를 팔로우 하는 사람들 목록 불러오기 
router.delete("/follower/:userId", isLoggedIn, removeFollower); // 나의 팔로워를 팔로우 취소하기  

// 와일드 카드는 맨 아래에 두기. 
// 내가 지금까지 404에 안 걸렸던 이유: 운좋게 rest api method가 서로 달랐기 때문에 node가 그냥 지나쳐 준 거임oo.
router.get("/", loadMyInfo); // 브라우저에서 새로고침 할때마다 보낼거임
router.get("/:userId", loadUser);
router.get("/:userId/posts", loadPostsByUser); 

module.exports = router;