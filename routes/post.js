const { Router } = require('express');
const { addPost, loadPost, editPost, removePost, 
  addComment, loadComment, editComment, removeComment } = require("../controllers/post");
const { isLoggedIn } = require("../controllers/middlewares");

const router = Router();

router.post('/', isLoggedIn, addPost);
router.get('/:postId', isLoggedIn, loadPost);
router.patch('/:postId', isLoggedIn, editPost);
router.delete('/:postId', isLoggedIn, removePost); 

router.post('/:postId/comment/', isLoggedIn, addComment);
router.get('/:postId/comment/:commentId', isLoggedIn, loadComment);
router.patch('/:postId/comment/:commentId', isLoggedIn, editComment);
router.delete('/:postId/comment/:commentId', isLoggedIn, removeComment); 

module.exports = router;
