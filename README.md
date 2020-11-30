# fakezhihu-server

用于提供后端api接口

## 对应的前端项目

[fakezhihu](https://github.com/cwy007/fakezhihu)

## 参考

* [encodeURI()和encodeURIComponent() 区别](https://blog.csdn.net/qq_34629352/article/details/78959707)
* [终于讲清楚了nodejs中exports和module.exports的区别](https://www.jianshu.com/p/43b151089d29)
* [http状态码204/206/200理解](http://www.mamicode.com/info-detail-1825350.html)
* [HTTP状态码 201 304 404 500等代表的含义](https://blog.csdn.net/sinat_36067127/article/details/74841769)
* [注意: 在 REPL 中不要声明 特殊变量 "_"，安装 n_ 来代替。](http://lodash.think2011.net/getting-started)
*[Node.js REPL with lodash](https://github.com/borisdiakur/n_#readme)
*[DatabaseError [SequelizeDatabaseError]: Not unique table/alias: 'comments'](https://stackoverflow.com/questions/53491063/sequelize-not-unique-table-alias)

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
