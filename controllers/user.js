const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');

exports.signUp = async (req, res, next) => {
  const existingEmail = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (existingEmail){
    return res.status(403).send('This email is already in use.');
  }
  const existingUsername = await User.findOne({
    where: {
      username: req.body.username
    }
  });
  if (existingUsername){
    return res.status(403).send('This username is already in use.');
  }
  try {
    console.log(req.body);
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(req.body.pass, salt);
    await User.create({
      username: req.body.username,
      email: req.body.email,
      pass: hashedPass,
      salt
    });
    return res.status(201).send('User is registered.');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.logIn = (req, res, next) => {
  passport.authenticate('local', (serverError, user, clientError) => {
    if (serverError) {
      return next(serverError);
    }
    if (clientError) { // unauthorized
      console.log(clientError);
      return res.status(401).send(clientError.message);
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      const fullUser = await User.findOne({
        where: {
          id: user.id
        },
        attributes: {
          exclude: ['pass'],
        },
        include: [{
          model: Post,
          attributes: ['id']
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id']
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id']
        }],
      })
      return res.status(200).json(fullUser);
    })
  })(req, res, next);
}

exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
  // req.logout();
  // req.session.destroy();
  // res.send('ok');
}

exports.loadMyInfo = async (req, res, next) => {
  console.log(req.headers); // cookie 확인
  try {
    if (req.user){
      const fullUser = await User.findOne({
        where: {
          id: req.user.id,
        },
        attributes: {
          exclude: ['pass'],
        },
        include: [{
          model: Post,
          attributes: ['id']
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id']
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id']
        }],
      });
      return res.status(200).json(fullUser);
    } else {
      return res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}

exports.loadUser = async (req, res, next) => {
  try {
    const fullUser = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['pass'],
      },
      include: [{
        model: Post,
        attributes: ['id']
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id']
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id']
      }],
    });
    if (!fullUser){
      return res.status(404).send('There is no such a user.');
    }
    return res.status(200).json(fullUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

exports.changeUsername = async (req, res, next) => {
  const existingUsername = await User.findOne({
    where: {
      username: req.body.username
    }
  });
  if (existingUsername){
    return res.status(403).send('This username is already in use.');
  }
  try {
    await User.update({
      username: req.body.username
    },{
      where: {
        id: req.user.id,
      },
    });

    return res.status(200).json({ username: req.body.username });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.loadFollowings = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id
    }
  })
  if(!user){
    return res.status(403).send('존재하지 않는 user 입니다.');
  }
  try {
    const followings = await user.getFollowings();

    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.follow = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.params.userId, // following
    }
  });
  if(!user){
    return res.status(403).send('존재하지 않는 user 입니다.');
  }
  try {
    await user.addFollowers(req.user.id); // 내 userId

    return res.status(200).json({ 
      id: parseInt(req.params.userId),  // 상대방 userId
      username: req.body.username // follower = 나
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.unfollow = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.params.userId, // following 
    }
  });
  if(!user){
    return res.status(403).send('존재하지 않는 user 입니다.');
  }
  try {
    await user.removeFollowers(req.user.id); // 상대방의 follower = 나

    return res.status(200).json({ 
      id: parseInt(req.params.userId),  // 상대방 userId
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.loadFollowers = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id
    }
  })
  if(!user){
    return res.status(403).send('존재하지 않는 user 입니다.');
  }
  try {
    const followers = await user.getFollowers();
    
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.removeFollower = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.params.userId, // 상대방 = 나의 follower
    }
  });
  if(!user){
    return res.status(403).send('존재하지 않는 user 입니다.');
  }
  try {
    await user.removeFollowings(req.user.id); // 상대방의 following = 나

    return res.status(200).json({ 
      id: parseInt(req.params.userId),  // 상대방 userId
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
