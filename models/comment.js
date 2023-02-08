module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.Post); //
    db.Comment.belongsTo(db.User); // 
  }
  
  return Comment;
}