const model = require('../models');
const { users: User } = model;
const _ = require('lodash');
const utils = require('../lib/utils');
const { userAttributes } = require('../config/default');

const list = async (ctx, next) => {
  try {
    const users = await User.findAll();
    ctx.response.status = 200;
    ctx.response.body = users;
  } catch (error) {
    utils.catchError(ctx, error);
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
    utils.catchError(ctx, error);
  }
}

const loginUser = async (ctx, next) => {
  const { name, pwd } = ctx.request.body;
  const where = { name, pwd };
  const attributes = ['name', 'id', 'email'];
  try {
    await User.findOne({
      where, attributes
    }).then((res) => {
      if (res === null) {
        // 206 Partial Content 服务器已经完成了部分用户的GET请求
        ctx.response.status = 206;
        ctx.response.body = {
          msg: '用户名或者密码不对，请修改后重新登录'
        };
        return ;
      } else {
        utils.setCookies(ctx, res.dataValues);
        ctx.response.status = 200;
        ctx.response.body = res;
      }
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const checkLogin = async (ctx, next) => {
  try {
    if (ctx.cookies.get('id')) {
      await User.findOne({
        where: { id: ctx.cookies.get('id') },
        attributes: userAttributes
      }).then((res) => {
        ctx.response.body = {
          status: 200,
          name: res.name,
          avatarUrl: res.avatarUrl
        };
      })
    } else {
      // 202——接受和处理、但处理未完成
      ctx.response.status = 202;
    }
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const logout = async (ctx, next) => {
  const cookies = {
    id: ctx.cookies.get('id'),
    name: ctx.cookies.get('name'),
    email: ctx.cookies.get('email')
  }
  try {
    utils.destroyCookies(ctx, cookies);
    ctx.response.status = 200;
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const getUserInfo = async (ctx, next) => {
  const { userId } = ctx.request.query;
  try {
    await User.findOne({
      where: { id: userId },
      attributes: userAttributes
    }).then((res) => {
      ctx.response.body = {
        status: 200,
        content: res
      };
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const updateUserInfo = async (ctx, next) => {
  const { id, colName, value } = ctx.request.body;
  try {
    await User.update(
      {[colName]: value},
      { where: {id}}
    ).then((res) => {
      ctx.response.body = {
        status: 201,
        content: res // res 为 [0] 是表示失败
      };
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

module.exports = {
  "GET /users/list": list,
  "POST /users/create": createUser,
  "POST /users/login": loginUser,
  "GET /users/checkLogin": checkLogin,
  "POST /users/logout": logout,
  "GET /users": getUserInfo,
  "PUT /users": updateUserInfo
}
