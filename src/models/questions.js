module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('questions', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.CHAR
    },
    excerpt: {
      type: DataTypes.CHAR
    },
    description: {
      type: DataTypes.TEXT
    },
    creatorid: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  });
  Question.associate = (models) => {
    Question.belongsTo(models.users, { foreignKey: 'creatorId', as: 'author' });
    Question.hasMany(models.answers, { foreignKey: 'targetId', as: 'answers' })
  }
  return Question;
}