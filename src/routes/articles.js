const model = require('../models');
const { articles: Article, statuses: Status } = model;
const _ = require('lodash');
const utils = require('../lib/utils');
const { userAttributes, articleAttributes } = require('../config/default');

const articleInclude = [{
  model: model.users,
  attributes: userAttributes,
  as: 'author'
}, {
  model: model.statuses,
  as: 'status',
  where: {
    targetType: 0 // 文章0、问题1、答案2
  }
}];

const createArticles = async (ctx, next) => {
  const { content, excerpt, title, imgUrl, userId } = ctx.request.body;
  try {
    await Article.create({
      content, excerpt, title, cover: imgUrl, creatorId: userId, type: 0
    }).then((res) => {
      return Status.create({
        voteUp: '[]', // 支持
        voteDown: '[]', // 反对
        favorite: '[]', // 收藏
        thanks: "[]", // 感谢
        targetId: res.dataValues.id, // 目标id
        targetType: 0  // 目标类型
      }).then((res) => {
        ctx.response.body = {
          status: 201,
          msg: '创建成功'
        }
      });
    });
  } catch (error) {
    utils.catchError(error);
  }
}

const deleteArticles = async (ctx, next) => {
  const { articleId, userId } = ctx.request.body;
  const where = {
    id: articleId,
    creatorId: userId
  };
  try {
    const articleExist = await Article.findOne({where});
    if (articleExist) {
      await Article.destroy({where}).then((res) => {
        return Status.destroy({where: {
          targetId: articleId,
          targetType: 0
        }}).then((response) => {
          ctx.response.body = {
            status: 202,
            msg: '删除成功'
          };
        });
      });
    } else {
      ctx.response.body = {
        status: 2001,
        msg: '文章不存在或者没有权限'
      }
    }
  } catch (error) {
    utils.catchError(error);
  }
}

const getArticle = async (ctx, next) => {
  const { articleId } = ctx.query;
  const where = { id: articleId };
  try {
    await Article.findOne({
      where,
      include: articleInclude,
      attributes: articleAttributes
    }).then((res) => {
      ctx.response.body = {
        status: 200,
        content: res
      }
    })
  } catch (error) {
    utils.catchError(error);
  }
}

const getArticleList = async (ctx, next) => {
  try {
    const order = [['id', 'DESC']];
    const limit = 10;
    const articleList = await Article.findAll({
      order,
      limit,
      include: articleInclude,
      attributes: articleAttributes
    });
    ctx.response.body = {
      status: 200,
      list: articleList
    }
  } catch (error) {
    utils.catchError(error);
  }
}

const updateArticles = async (ctx, next) => {
  const {articleId, content, excerpt, title, imgUrl, userId } = ctx.request.body;
  const where = { id: articleId, creatorId: userId };
  try {
    const articleExist = await Article.findOne({where});
    if (!articleExist) {
      ctx.response.body = {
        status: 2001,
        msg: '文章不存在或者没有权限'
      };
    } else {
      await Article.update(
        { content, excerpt, title, cover: imgUrl }, { where }
      ).then((res) => {
        ctx.response.body = {
          status: 201,
          msg: '文章修改成功'
        };
      });
    }
  } catch (error) {
    utils.catchError(error);
  }
}

module.exports = {
  "POST /articles": createArticles,
  "DELETE /articles": deleteArticles,
  "GET /articles": getArticle,
  "GET /articles/list": getArticleList,
  "PUT /articles": updateArticles
}
