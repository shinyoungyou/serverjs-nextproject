const { User, Post, Comment, Hashtag, Image } = require('../models');

exports.loadPosts = async (req, res, next) => {
  const allPosts = await Post.findAll({
    // where: {
    //   id: lastId
    // },
    limit: 10,
    order: [
      ['createdAt', 'DESC'],
      [Comment, 'createdAt', 'DESC'],
    ],
    include: [{
      model: Image,
      attributes: ['id', 'src', 'alt', 'PostId']
    },{
      model: User,
      attributes: ['id', 'username']
    }, {
      model: Comment,
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    }, {
      model: User,
      as: 'Likers',
      attributes: ['id']
    },{
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
    },]
  });
  if (!allPosts){
    return res.status(404).send('There is no post yet.');
  }
  try {
    // console.log(req.body);
    return res.status(200).json(allPosts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.loadMyPosts = async (req, res, next) => {
  const myPosts = await Post.findOne({
    where: {
      UserId: req.body.userId
    }
  });
  if (!myPosts){
    return res.status(404).send('There is no post yet.');
  }
  try {
    // console.log(req.body);
    return res.status(200).json(myPosts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}