const config = {
  "db": {
    "database": "fakezhihu",
    "username": "root",
    "password": "123",
    "options": {
      "dialect": "mysql",
      "host": "127.0.0.1",
      "port": 3306
    }
  },
  "userAttributes": ['id', 'name', 'email', 'avatarUrl', 'headline'],
  "commentAttributes": ['creatorId', 'content', 'targetId', 'createdAt', 'type', 'id'],
  "articleAttributes": ['id', 'title', 'excerpt', 'content', 'cover', 'creatorId', 'type', 'updatedAt'],
  "questionAttributes": ['id', 'title', 'excerpt', 'description', 'updatedAt'],
  "answerAttributes": ['id', 'content', 'excerpt', 'creatorId', 'type', 'targetId', 'updatedAt']
}

module.exports = config;
