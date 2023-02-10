const { Router } = require('express');
const { signUpUser, logInUser } = require("../controllers/user");

const router = Router();

router.post("/", signUpUser);
router.post("/login", logInUser);

module.exports = router;