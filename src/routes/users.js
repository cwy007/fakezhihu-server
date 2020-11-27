const model = require('../models');
const { users: User } = model;

const catchError = (ctx, err) => {
  console.log(err);
  ctx.resError = err;
}

const list = async (ctx, next) => {
  try {
    const users = await User.findAll();
    ctx.response.status = 200;
    ctx.response.body = users;
  } catch (error) {
    catchError(ctx, error);
  }
}

module.exports = {
  "GET /users/list": list
}
