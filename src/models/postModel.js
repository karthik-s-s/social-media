const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Post = sequelize.define('Post', {
  username: { type: DataTypes.STRING, allowNull: false },
  photoPath: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Post;
