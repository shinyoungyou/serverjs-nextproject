const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');

exports.signUpUser = async (req, res, next) => {
  const existingUser = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (existingUser){
    return res.status(403).send('This email is already in use.');
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

exports.logInUser = (req, res, next) => {
  passport.authenticate('local', (serverError, user, clientError) => {
    if (serverError) {
      return next(serverError);
    }
    if (clientError) { // unauthorized
      return res.status(401).send(clientError.reason);
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

exports.loadUser = async (req, res, next) => {
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
}

exports.logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
  // req.logout();
  // req.session.destroy();
  // res.send('ok');
}