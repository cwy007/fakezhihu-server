const users = (ctx, next) => {
  ctx.body = 'this is a users response!'
}

const usersBar = (ctx, next) => {
  ctx.body = 'this is a users/bar response'
}

module.exports = {
  "GET /users": users,
  "GET /users/bar": usersBar
}
