const { Router } = require('express');
const { signUpUser, logInUser, loadUser, logOutUser } = require("../controllers/user");
const { isLoggedIn, isNotLoggedIn } = require("../controllers/middlewares");

const router = Router();

router.post("/", isNotLoggedIn, signUpUser);
router.post("/login", isNotLoggedIn, logInUser);

router.get("/", loadUser); // 브라우저에서 새로고침 할때마다 보낼거임

router.post("/logout", isLoggedIn, logOutUser);

module.exports = router;