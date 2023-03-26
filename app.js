const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();

const app = express();

db.sequelize.sync()
  .then(()=>{
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

app.use(cors({
  origin: 'http://localhost:3060',
  credentials: true,
})); 
app.use(express.json()); // axios로 data보낼 때
// multipart data = file img video
app.use(express.urlencoded({ extended: true })); // 일반 form 일 때에는 url encoded로 받음 (multipart/form이 아닌 일반 form)
app.use(morgan("dev"));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.post('/api/post', (req, res) => {
  res.send('this is post http method');
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);

module.exports = app;
