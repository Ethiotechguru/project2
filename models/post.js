'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    image: DataTypes.STRING,
    caption: DataTypes.STRING
  }, {});
  post.associate = function(models) {
    // associations can be defined here
    models.post.belongsTo(models.user);
  };
  return post;
};