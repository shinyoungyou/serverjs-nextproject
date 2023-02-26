const { Router } = require('express');
const { loadPosts } = require("../controllers/posts");

const router = Router();

router.get("/", loadPosts);
// router.get("/", loadMyPosts);
// router.get("/", loadPostsByOther);


module.exports = router;



