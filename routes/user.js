const { Router } = require('express');
const { signUp, logIn, logOut, loadMyInfo, changeUsername, 
  loadFollowings, follow, unfollow, 
  loadFollowers, removeFollower } = require("../controllers/user");
const { isLoggedIn, isNotLoggedIn } = require("../controllers/middlewares");

const router = Router();

router.post("/", isNotLoggedIn, signUp);
router.post("/login", isNotLoggedIn, logIn);
router.post("/logout", isLoggedIn, logOut);

router.get("/", loadMyInfo); // 브라우저에서 새로고침 할때마다 보낼거임

router.patch("/profile", isLoggedIn, changeUsername); 

router.get("/followings", isLoggedIn, loadFollowings); // 내가 팔로우 하는 사람들 목록 불러오기 
router.put("/following/:userId", isLoggedIn, follow); // 팔로우 하기 or 나의 팔로워를 팔로우 하기
router.delete("/following/:userId", isLoggedIn, unfollow); // 팔로우 취소하기

router.get("/followers", isLoggedIn, loadFollowers); // 나를 팔로우 하는 사람들 목록 불러오기 
router.delete("/follower/:userId", isLoggedIn, removeFollower); // 나의 팔로워를 팔로우 취소하기  

module.exports = router;