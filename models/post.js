'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    image: DataTypes.STRING,
    caption: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  post.associate = function(models) {
    // associations can be defined here
    models.post.belongsTo(models.user);
    models.post.hasMany(models.comment);
  };
  return post;
};