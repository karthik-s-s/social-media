const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ViewedPost = sequelize.define(
  'ViewedPost',
  {
    username: { type: DataTypes.STRING, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['username', 'postId'],
      },
    ],
  }
);

module.exports = ViewedPost;
