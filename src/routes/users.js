const model = require('../models');
const { users: User } = model;
const _ = require('lodash');

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

const createUser = async (ctx, next) => {
  const { name, pwd, email } = ctx.request.body;
  try {
    const infoList = await User.findAll({
      attributes: ['name', 'email']
    });
    const nameList = _.map(infoList, item => item.dataValues.name);
    if (_.includes(nameList, name)) {
      // 203 - 非权威性信息
      ctx.response.status = 203;
      ctx.response.body = {
        msg: '用户名重复，请更换用户名'
      };
      return;
    }
    const uniquedEmailList = _.map(infoList, item => item.dataValues.email);
    if (_.includes(uniquedEmailList, email)) {
      ctx.response.status = 203;
      ctx.response.body = {
        msg: '邮箱已存在，请更换邮箱或者直接登录'
      };
      return ;
    };
    await User.create({
      name, pwd, email
    }).then((res) => {
      ctx.response.status = 201;
      ctx.response.body = res;
    })
  } catch (error) {
    catchError(ctx, error);
  }
}

module.exports = {
  "GET /users/list": list,
  "POST /users/create": createUser
}
