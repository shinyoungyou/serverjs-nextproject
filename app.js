const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('./models');

const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');

const app = express();

db.sequelize.sync()
  .then(()=>{
    console.log('db 연결 성공');
  })
  .catch(console.error);

app.use(cors(['http://localhost:3060'])); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.post('/api/post', (req, res) => {
  res.send('this is post http method');
});

app.use("/user", userRouter);
app.use("/posts", postsRouter);

module.exports = app;
