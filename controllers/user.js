const { User } = require('../models');
const bcrypt = require('bcrypt');

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
    res.status(201).send('User is registered.');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.logInUser = async (req, res) => {
  console.log(req.body);
  const getUser = User.findOne({
    where: {
      email: req.body.email
    }
  })
  if (!getUser){
    return res.status(403).send('Please signup first.');
  }
  console.log(getUser);
  res.status(200).json(getUser);
}