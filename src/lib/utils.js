const _ = require('lodash');

exports.setCookies = (ctx, info) => {
  if (!_.isObject(info)) {
    return false;
  }
  _.forIn(info, (value, key) => {
    ctx.cookies.set(key, encodeURIComponent(value), {
      domain: 'localhost',
      path: '/',
      maxAge: 24*60*60*1000,
      httpOnly: false,
      overwrite: false
    });
  });
}

exports.destroyCookies = (ctx, info) => {
  if (!_.isObject(info)) {
    return false;
  }
  _.forIn(info, (value, key) => {
    ctx.cookies.set(key, value, {
      maxAge: -1
    });
  })
}

exports.catchError = (ctx, err) => {
  console.log(err);
  ctx.resError = err;
}
