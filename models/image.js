module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    src: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    alt: {
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

  Image.associate = (db) => {
    db.Image.belongsTo(db.Post); //
  }

  return Image;
}