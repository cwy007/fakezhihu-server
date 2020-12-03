# fakezhihu-server

用于提供后端api接口

## book

《Vue.js前端开发基础与项目实战》• 郑韩京/编著

![book](https://tva1.sinaimg.cn/large/0081Kckwly1glat46k4lrj309y0dwtby.jpg)

## 对应的前端项目

[fakezhihu](https://github.com/cwy007/fakezhihu)


## 在本地环境运行

启动mysql，新建数据库fakezhihu，使用[sql脚本](https://github.com/cwy007/fakezhihu-server/blob/main/data/query.sql)新建项目所需的数据库表

```shell
git clone https://github.com/cwy007/fakezhihu-server.git
cd fakezhihu-server
npm install
npm run dev
```

## 启动项目时，会打印出已经实现的接口

```shell
 cwy@Mpro ⮀ ~/tmp/fakezhihu-server ⮀ ⭠ main ⮀ npm run start

> fakezhihu-server@0.1.0 start /Users/chanweiyan/tmp/fakezhihu-server
> node bin/www

process controller: answers.js...
register URL mapping: POST /answers
register URL mapping: DELETE /answers
register URL mapping: PUT /answers
register URL mapping: GET /answers/creator
process controller: articles.js...
register URL mapping: POST /articles
register URL mapping: DELETE /articles
register URL mapping: GET /articles
register URL mapping: GET /articles/list
register URL mapping: PUT /articles
register URL mapping: GET /articles/creator
process controller: comments.js...
register URL mapping: GET /comments
register URL mapping: POST /comments
register URL mapping: DELETE /comments
process controller: imgs.js...
register URL mapping: POST /imgs/upload
process controller: index.js...
register URL mapping: GET /create
register URL mapping: GET /
process controller: questions.js...
register URL mapping: POST /questions
register URL mapping: PUT /questions
register URL mapping: GET /questions
register URL mapping: GET /questions/creator
process controller: status.js...
register URL mapping: PUT /status
process controller: users.js...
register URL mapping: GET /users/list
register URL mapping: POST /users/create
register URL mapping: POST /users/login
register URL mapping: GET /users/checkLogin
register URL mapping: POST /users/logout
register URL mapping: GET /users
register URL mapping: PUT /users
==============================================================
 Fakezhihu-server
--------------------------------------------------------------
 Start prot : 3000
 Up time: Thu Dec 03 2020 17:46:03 GMT+0800 (China Standard Time)
==============================================================
```

## targetType 字段

```js
question 没有 status
// 文章0、问题1、答案2

statuses 表
targetType: {
  0: 'article',
  1: 'question',
  2: 'answer',
  3: 'comment'
}

comments 表
targetType 字段
// article:0, question:1, answer: 2, comment:3
```

## 参考

* [encodeURI()和encodeURIComponent() 区别](https://blog.csdn.net/qq_34629352/article/details/78959707)
* [终于讲清楚了nodejs中exports和module.exports的区别](https://www.jianshu.com/p/43b151089d29)
* [http状态码204/206/200理解](http://www.mamicode.com/info-detail-1825350.html)
* [HTTP状态码 201 304 404 500等代表的含义](https://blog.csdn.net/sinat_36067127/article/details/74841769)
* [注意: 在 REPL 中不要声明 特殊变量 "_"，安装 n_ 来代替。](http://lodash.think2011.net/getting-started)
*[Node.js REPL with lodash](https://github.com/borisdiakur/n_#readme)
*[DatabaseError [SequelizeDatabaseError]: Not unique table/alias: 'comments'](https://stackoverflow.com/questions/53491063/sequelize-not-unique-table-alias)
* 出现报错时 `ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)`重启mysql服务
