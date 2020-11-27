const index = async (ctx, next) => {
  await ctx.render("index", {
    title: "koa2"
  })
}

const error = async (ctx, next) => {
  await ctx.render("error")
}

module.exports = {
  "GET /": index,
  "GET /error": error
}
