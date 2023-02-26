const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
  }, async (email, pass, done) => {
    try {
      const user = await User.findOne({
        where: {
          email
        }
      })
      if (!user) {
        return done(null, false, { reason: '존재하지 않는 user 입니다.'});
      }
      const result = await bcrypt.compare(pass, user.pass);
      if(result){
        return done(null, user);
      }
      return done(null, false, { reason: '비밀번호가 틀렸습니다.'});
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
}
