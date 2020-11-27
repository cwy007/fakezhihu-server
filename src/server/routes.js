const fs = require("fs");

/**
 * 根据暴露的信息判断请求类型
 * @param {*} router require("koa-router")()
 * @param {*} mapping 路由文件中暴露的信息
 */
const addMapping = (router, mapping) => {
  for (const url in mapping) {
    if (url.startsWith("GET")) {
      const path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`register URL mapping: GET ${path}`);

    } else if (url.startsWith("POST")) {
      const path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`register URL mapping: POST ${path}`);

    } else if (url.startsWith("PUT")) {
      const path = url.substring(4);
      router.put(path, mapping[url]);
      console.log(`register URL mapping: PUT ${path}`);

    } else if (url.startsWith("DELETE")) {
      const path = url.substring(7);
      router.delete(path, mapping[url]);
      console.log(`register URL mapping: DELETE ${path}`);

    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

/**
 * 处理js文件
 * @param {*} router
 * @param {*} dir controllers_dir
 */
const addControllers = (router, dir) => {
  fs.readdirSync(__dirname + "/" + dir).filter((f) => {
    return f.endsWith(".js");
  }).forEach((f) => {
    console.log(`process controller: ${f}...`);
    let mapping = require(__dirname + "/" + dir + "/" + f);
    addMapping(router, mapping);
  })
}

/**
 * 暴露路由处理结果
 * @param {*} dir
 */
module.exports = (dir) => {
  const controllers_dir = dir || "./../routes";
  const router = require("koa-router")();
  addControllers(router, controllers_dir);
  return router.routes();
}
