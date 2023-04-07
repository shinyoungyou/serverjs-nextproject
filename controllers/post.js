const path = require('path');

const { Post, Comment, User, Image } = require('../models');

exports.uploadImage = async (req, res, next) => {
  try {
    console.log(req.files);
    return res.status(201).json(req.files.map((v) => v.filename));
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.addPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id
    });

    if (req.body.images) {
      console.log(req.body.images);
      const images = await Promise.all(req.body.images.map((image) => Image.create({ 
        src: image, 
        alt: path.parse(image).name
      })));
      await post.addImages(images);
    }

    const fullPost =  await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
        attributes: ['id', 'src', 'alt', 'PostId']
      },{
        model: User, // post author
        attributes: ['id', 'username']
      },{
        model: Comment,
        include: [{
          model: User, // comment author
          attributes: ['id', 'username']
        }]
      },{
        model: User, // liker
        as: 'Likers',
        attributes: ['id'] // 일단 이렇게 해서 어떻게 나오는 지 보고, 프론트랑 안 맞다 싶으면 바꾸기
      }],
    });

    return res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.loadPost = async (req, res, next) => {
  const fullPost =  await Post.findOne({
    where: { id: req.params.postId },
    include: [{
      model: Image,
      attributes: ['id', 'src', 'alt', 'PostId']
    },{
      model: User, // post author
      attributes: ['id', 'username']
    },{
      model: Comment,
      include: [{
        model: User, // comment author
        attributes: ['id', 'username']
      }]
    },{
      model: User, // liker
      as: 'Likers',
      attributes: ['id'] // 일단 이렇게 해서 어떻게 나오는 지 보고, 프론트랑 안 맞다 싶으면 바꾸기
    }],
  });

  if (!fullPost){
    return res.status(404).send('There is no such a post.');
  }
  try {
    return res.status(200).json(fullPost);
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
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
      attributes: ['updatedAt']
    })

    console.log(post);

    return res.status(201).send({ 
      id: parseInt(req.params.postId), 
      content: req.body.content, 
      updatedAt: post.updatedAt 
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.removePost = async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        RetweetId: req.params.postId,
      }
    });

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

    const comment = await Comment.findOne({
      where: {
        id: req.params.commentId,
      },
      attributes: ['updatedAt']
    });

    return res.status(201).send({
      PostId: parseInt(req.params.postId), 
      id: parseInt(req.params.commentId),
      content: req.body.content,
      updatedAt: comment.updatedAt,
    });
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

exports.retweet = async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet'
      }]
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    console.log(post);

    const originalPostId = post.RetweetId || post.id;

    const existingPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: originalPostId,
      },
    });
    if (existingPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }

    const retweetPost = await Post.create({
      UserId: req.user.id,
      RetweetId: originalPostId,
      content: 'retweet',
    });

    const fullRetweetPost =  await Post.findOne({
      where: { id: retweetPost.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: Image,
          attributes: ['id', 'src', 'alt', 'PostId']
        },{
            model: User, // post author
            attributes: ['id', 'username']
        },{
            model: Comment,
            include: [{
              model: User, // comment author
              attributes: ['id', 'username']
            }]
        },{
            model: User, // liker
            as: 'Likers',
            attributes: ['id']
        }]
      },{
          model: User, // author who is retweeting
          attributes: ['id', 'username']
      }],
    });

    return res.status(201).json(fullRetweetPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.addQuoteTweet = async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet'
      }]
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    console.log(post);

    const originalPostId = post.RetweetId || post.id;

    const existingPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: originalPostId,
      },
    });
    if (existingPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }

    const retweetPost = await Post.create({
      UserId: req.user.id,
      RetweetId: originalPostId,
      content: 'retweet',
    });

    const fullRetweetPost =  await Post.findOne({
      where: { id: retweetPost.id },
      include: [{
          model: Image,
          attributes: ['id', 'src', 'alt', 'PostId']
      },{
          model: User, // post author
          attributes: ['id', 'username']
      },{
          model: Comment,
          include: [{
            model: User, // comment author
            attributes: ['id', 'username']
          }]
      },{
          model: User, // liker
          as: 'Likers',
          attributes: ['id'] // 일단 이렇게 해서 어떻게 나오는 지 보고, 프론트랑 안 맞다 싶으면 바꾸기
      }],
    });

    return res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

