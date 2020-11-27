const model = require('../models');
const { users: User } = model;

const list = async (ctx, next) => {
  const all = await User.findAll({});
  ctx.response.status = 200;
  ctx.response.body = all;
}

const create = async (ctx, next) => {
  const user = await User.create({
    name: 'RZ',
    age: 16,
    gender: false
  });
  ctx.response.status = 201;
  ctx.response.body = user;
}

module.exports = {
  "GET /create": create,
  "GET /": list
}
