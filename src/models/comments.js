module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comments', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    creatorId: {
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.TEXT
    },
    targetId: {
      type: DataTypes.INTEGER
    },
    targetType: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.users, { foreignKey: 'creatorId', as: 'author' });
    Comment.hasMany(models.comments, { foreignKey: 'targetId', as: 'comments' });
    Comment.hasOne(models.statuses, { foreignKey: 'targetId', as: 'status' });
  }
  return Comment; // 不要忘了return语句
}