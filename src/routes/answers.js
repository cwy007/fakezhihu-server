const model = require('../models');
const { answers: Answer, statuses: Status } = model;
const { answerAttributes } = require('../config/default');
const _ = require('lodash');
const { utils } = require('../lib/utils');

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
    utils.catchError(error);
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
    utils.catchError(error);
  }
}

const updateAnswer = async (ctx, next) => {
  const { creatorid, answerId, content, excerpt } = ctx.request.body;
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
    utils.catchError(error);
  }
}

module.exports = {
  'POST /answers': createAnswer,
  'DELETE /answers': deleteAnswers,
  'PUT /answers': updateAnswer
}