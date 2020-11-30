const model = require('../models');
const { comments: Comment, statuses: Status } = model;
const utils = require('../lib/utils');
const { userAttributes, commentAttributes } = require('../config/default');

const commentInclude = [{
  model: model.users,
  as: 'author',
  attributes: userAttributes
}, {
  model: model.statuses,
  as: 'status',
  where: { targetType: 3} // article:0, question:1, answer:2, status:3
}, {
  model: model.comments,
  // 这里的as要与model中指定关联的as保持一直
  as: 'subComments', // 这里要写字符串；
  required: false,
  where: { targetType: 3 } // question:1, answer: 2, comment:3
}];

const getComments = async (ctx, next) => {
  const order = [['id', 'DESC']];
  const { targetId, targetType } = ctx.query;
  const where = { targetId, targetType };
  try {
    await Comment.findAll({
      order,
      where,
      include: commentInclude,
      attributes: commentAttributes
    }).then((res) => {
      ctx.response.body = {
        status: 200,
        list: res
      };
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const createComment = async (ctx, next) => {
  const { targetId, targetType, creatorId, content } = ctx.request.body;
  try {
    // type: 3 当前类型
    await Comment.create({
      creatorId, targetId, targetType, content, type: 3
    }).then((res) => {
      return Status.create({
        voteUp: '[]',
        voteDown: '[]',
        favorite: '[]',
        thanks: '[]',
        targetId: res.dataValues.id,
        targetType: 3 // 目标类型
      }).then((res) => {
        ctx.response.body = {
          status: 201,
          msg: '创建成功'
        }
      })
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const deleteComment = async (ctx, next) => {
  const { id, creatorId } = ctx.request.body;
  try {
    await Comment.destroy({
      where: { id, creatorId }
    }).then((res) => {
      return Status.destroy({
        where: { targetId: id, targetType: 3 }
      }).then((response) => {
        ctx.response.body = {
          status: 202,
          msg: '删除成功'
        };
      });
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

module.exports = {
  'GET /comments': getComments,
  'POST /comments': createComment,
  'DELETE /comments': deleteComment
}