const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Blog = require('./Blog');

const Comment = sequelize.define('Comment', {
  content: { type: DataTypes.TEXT, allowNull: false }
});

Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'userId' });

Comment.belongsTo(Blog, { foreignKey: 'blogId', onDelete: 'CASCADE' });
Blog.hasMany(Comment, { foreignKey: 'blogId' });

module.exports = Comment;
