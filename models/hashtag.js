module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define("Hashtag", {
    content: {
      type: DataTypes.STRING(50),
      allowNull: false
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

  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); //
  }

  return Hashtag;
}