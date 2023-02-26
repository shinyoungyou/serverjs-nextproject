const { Post, Comment, User, Image, Hashtag } = require('../models');

exports.addPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id
    });

    const fullPost =  await Post.findOne({
      where: {
        id: post.id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }, 
        {
          model: Image,
          attributes: ['id', 'src', 'alt']
        }
      ],
    });

    return res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.loadPost = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });
  if (!post){
    return res.status(404).send('There is no post yet.');
  }
  try {
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.editPost = async (req, res, next) => {
  try {
    await Post.update({
      content: req.body.content
    }, {
      where: {
        id: req.params.postId,
      }
    });

    return res.status(201).send('Post has been updated.');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.removePost = async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
      }
    });

    return res.status(201).send({ id: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.addComment = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });

  if(!post){
    return res.status(403).send('존재하지 않는 게시글 입니다.');
  }

  try {
    const comment = await Comment.create({
      content: req.body.content,
      UserId: req.user.id,
      PostId: parseInt(req.params.postId)
    });

    const fullComment = await Comment.findOne({
      where: {
        id: comment.id
      },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    })

    return res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

////////////////////////////////////////////////////

exports.loadComment = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });
  if(!post){
    return res.status(403).send('존재하지 않는 게시글 입니다.');
  }

  try {
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.editComment = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });
  if(!post){
    return res.status(403).send('존재하지 않는 게시글 입니다.');
  }

  try {
    await Comment.update({
      content: req.body.content,
    }, {
      where: {
        id: req.params.commentId,
      }
    });

    return res.status(201).send('Post has been uploaded.');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.removeComment = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });
  if(!post){
    return res.status(403).send('존재하지 않는 게시글 입니다.');
  }

  try {
    await Comment.destroy({
      where: {
        id: req.params.commentId,
      }
    });

    return res.status(201).send({ PostId: parseInt(req.params.postId), id: parseInt(req.params.commentId) });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.addLike = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });

  if(!post){
    return res.status(403).send('존재하지 않는 게시글 입니다.');
  }
  try {
    await post.addLikers(req.user.id);
    return res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.removeLike = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.postId,
    }
  });

  if(!post){
    return res.status(403).send('존재하지 않는 게시글 입니다.');
  }
  try {
    await post.removeLikers(req.user.id);
    return res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
