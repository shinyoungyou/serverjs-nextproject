module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    content: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    charset: 'utf8mb4', 
    collate: 'utf8mb4_general_ci'
  });

  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // 
    db.Post.hasMany(db.Comment); // 
    db.Post.hasMany(db.Image); //
    // db.Post.hasMany(db.User, { through: 'Like', as: 'Likers' }); // 
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // 

    // db.Post.hasMany(db.Post, { through: 'Retweet', as: 'Retweets' }) // retweeted original post
    //db.Post.belongsTo(db.Post, { through: 'Retweet' }) // post which retweets other post

    db.Post.belongsTo(db.Post, { as: 'Retweet' });
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //
  }

  return Post;
}