const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { addPost, editPost, removePost, 
  addComment, editComment, removeComment,
  addLike, removeLike,
  uploadImage } = require("../controllers/post");
const { isLoggedIn } = require("../controllers/middlewares");

const router = Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

router.post('/', isLoggedIn, addPost);
router.patch('/:postId', isLoggedIn, editPost);
router.delete('/:postId', isLoggedIn, removePost); 

router.post('/:postId/comment/', isLoggedIn, addComment);
router.patch('/:postId/comment/:commentId', isLoggedIn, editComment);
router.delete('/:postId/comment/:commentId', isLoggedIn, removeComment); 

router.post('/:postId/like', isLoggedIn, addLike);
router.delete('/:postId/like', isLoggedIn, removeLike); 

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads')
    },
    filename(rea, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + new Date + ext); 
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
})

router.post('/images', isLoggedIn, upload.array('image'), uploadImage);

module.exports = router;
