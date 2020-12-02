const model = require('../models');
const { answers: Answer, statuses: Status } = model;
const { answerAttributes, commentAttributes, questionAttributes, userAttributes } = require('../config/default');
const _ = require('lodash');
const utils = require('../lib/utils');

const createAnswer = async(ctx, next) => {
  const { creatorId, targetId, content, excerpt } = ctx.request.body;
  try {
    await Answer.create(
      { creatorId, targetId, content, excerpt, type: 2 }
    ).then((res) => {
      return Status.create({
        voteUp: '[]',
        voteDown: '[]',
        favorite: '[]',
        thanks: '[]',
        targetId: res.dataValues.id,
        targetType: 2
      }).then((res) => {
        ctx.response.body = {
          status: 201,
          msg: '创建成功'
        }
      });
    });
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const deleteAnswers = async (ctx, next) => {
  const { answerId, userId } = ctx.request.body;
  const where = { id: answerId, creatorId: userId };
  try {
    const answerExist = await Answer.findOne({where});
    if (answerExist) {
      await Answer.destroy({where}).then((res) => {
        return Status.destroy({
          where: { targetId: answerId, targetType: 2 }
        }).then((response) => {
          ctx.response.body = {
            status: 202,
            msg: '删除成功'
          }
        });
      });
    } else {
      ctx.response.body = {
        status: 2001,
        msg: '答案不存在或者没有权限'
      }
    }
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const updateAnswer = async (ctx, next) => {
  const { creatorId, answerId, content, excerpt } = ctx.request.body;
  const where = { creatorId, id: answerId };
  try {
    const answerExist = await Answer.findOne({where});
    if (answerExist) {
      await Answer.update({ content, excerpt }, { where }).then((res) => {
        ctx.response.body = {
          status: 201,
          msg: '答案修改成功'
        }
      });
    } else {
      ctx.response.body = {
        status: 2001,
        msg: '答案不存在或者没有权限'
      };
    }
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const creatorAnswer = async (ctx, next) => {
  const { creatorId } = ctx.query;
  const where = { creatorId };
  const include = [{
    model: model.comments,
    as: 'comments',
    attributes: commentAttributes,
    required: false,
    where: { targetType: 2 }
  }, {
    model: model.statuses, // model 这个字段要使用复数，表示对应的表名
    as: 'status',
    where: { targetType: 2 }
  }, {
    model: model.questions,
    as: 'question',
    attributes: questionAttributes
  }, {
    model: model.users,
    as: 'author',
    attributes: userAttributes
  }];
  try {
    console.log('开始查询 answers')
    await Answer.findAll({
      where, include,
      attributes: answerAttributes,
      order: [['updatedAt', 'DESC']]
    }).then((res) => {
      console.log('成功', res)
      ctx.response.body = {
        status: 200,
        list: res
      }
    })
  } catch (error) {
    console.log('出错了')
    utils.catchError(ctx, error);
  }
}

module.exports = {
  'POST /answers': createAnswer,
  'DELETE /answers': deleteAnswers,
  'PUT /answers': updateAnswer,
  'GET /answers/creator': creatorAnswer
}