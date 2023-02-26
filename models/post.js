module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    content: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    // status: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: true
    // }
  }, {
    charset: 'utf8mb4', 
    collate: 'utf8mb4_general_ci'
  });

  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post.addUser
    db.Post.hasMany(db.Comment); // post.addComments
    db.Post.hasMany(db.Image); // post.addImages
    // db.Post.hasMany(db.User, { through: 'Like', as: 'Likers' }); // 
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers post.removeLikers

    // db.Post.hasMany(db.Post, { through: 'Retweet', as: 'Retweets' }) // retweeted original post
    //db.Post.belongsTo(db.Post, { through: 'Retweet' }) // post which retweets other post

    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
  }

  return Post;
}