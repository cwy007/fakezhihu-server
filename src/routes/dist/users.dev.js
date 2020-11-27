"use strict";

var model = require('../models');

var User = model.users;

var _ = require('lodash');

var utils = require('../lib/utils');

var list = function list(ctx, next) {
  var users;
  return regeneratorRuntime.async(function list$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findAll());

        case 3:
          users = _context.sent;
          ctx.response.status = 200;
          ctx.response.body = users;
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          utils.catchError(ctx, _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var createUser = function createUser(ctx, next) {
  var _ctx$request$body, name, pwd, email, infoList, nameList, uniquedEmailList;

  return regeneratorRuntime.async(function createUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _ctx$request$body = ctx.request.body, name = _ctx$request$body.name, pwd = _ctx$request$body.pwd, email = _ctx$request$body.email;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findAll({
            attributes: ['name', 'email']
          }));

        case 4:
          infoList = _context2.sent;
          nameList = _.map(infoList, function (item) {
            return item.dataValues.name;
          });

          if (!_.includes(nameList, name)) {
            _context2.next = 10;
            break;
          }

          // 203 - 非权威性信息
          ctx.response.status = 203;
          ctx.response.body = {
            msg: '用户名重复，请更换用户名'
          };
          return _context2.abrupt("return");

        case 10:
          uniquedEmailList = _.map(infoList, function (item) {
            return item.dataValues.email;
          });

          if (!_.includes(uniquedEmailList, email)) {
            _context2.next = 15;
            break;
          }

          ctx.response.status = 203;
          ctx.response.body = {
            msg: '邮箱已存在，请更换邮箱或者直接登录'
          };
          return _context2.abrupt("return");

        case 15:
          ;
          _context2.next = 18;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            pwd: pwd,
            email: email
          }).then(function (res) {
            ctx.response.status = 201;
            ctx.response.body = res;
          }));

        case 18:
          _context2.next = 23;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](1);
          utils.catchError(ctx, _context2.t0);

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 20]]);
};

var loginUser = function loginUser(ctx, next) {
  var _ctx$request$body2, name, pwd, where, attributes;

  return regeneratorRuntime.async(function loginUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _ctx$request$body2 = ctx.request.body, name = _ctx$request$body2.name, pwd = _ctx$request$body2.pwd;
          where = {
            name: name,
            pwd: pwd
          };
          attributes = ['name', 'id', 'email'];
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            where: where,
            attributes: attributes
          }).then(function (res) {
            if (res === null) {
              // 206 Partial Content 服务器已经完成了部分用户的GET请求
              ctx.response.status = 206;
              ctx.response.body = {
                msg: '用户名或者密码不对，请修改后重新登录'
              };
              return;
            } else {
              utils.setCookies(ctx, res.dataValues);
              ctx.response.status = 200;
              ctx.response.body = res;
            }
          }));

        case 6:
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](3);
          utils.catchError(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 8]]);
};

var checkLogin = function checkLogin(ctx, next) {
  return regeneratorRuntime.async(function checkLogin$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            if (ctx.cookies.get('id')) {
              ctx.response.status = 200;
              ctx.response.body = {
                name: decodeURIComponent(ctx.cookies.get('name'))
              };
            } else {
              // 202——接受和处理、但处理未完成
              ctx.response.status = 202;
            }
          } catch (error) {
            utils.catchError(ctx, error);
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var logout = function logout(ctx, next) {
  var cookies;
  return regeneratorRuntime.async(function logout$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          cookies = {
            id: ctx.cookies.get('id'),
            name: ctx.cookies.get('name'),
            email: ctx.cookies.get('email')
          };

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  "GET /users/list": list,
  "POST /users/create": createUser,
  "POST /users/login": loginUser
};