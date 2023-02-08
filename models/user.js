module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    pass: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  })

  User.associate = (db) => {
    db.User.hasMany(db.Post); // 
    db.User.hasMany(db.Comment); //
    // db.User.belongsTo(db.Post, { through: 'Like' }); // 
    db.User.belongsToMany(db.Post, { through: 'Like' }); // 
    
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' }); //
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' }); //
  }

  return User;
}