const model = require('../models');
const { questions: Question } = model;
const utils = require('../lib/utils');
const { userAttributes, questionAttributes } = require('../config/default');

const createQuestion = async (ctx, next) => {
  const { description, excerpt, title, userId } = ctx.request.body;
  try {
    await Question.create({
      description, excerpt, title, creatorId: userId, type: 1
    }).then((res) => {
      ctx.response.body = {
        status: 201,
        msg: '创建成功'
      }
    });
  } catch (error) {
    utils.catchError(error);
  }
}

const updateQuestion = async (ctx, next) => {
  const { questionId, description, excerpt, title, userId } = ctx.request.body;
  const where = { id: questionId, creatorId: userId };
  try {
    const questionExist = await Question.findOne({where});
    if (!questionExist) {
      ctx.response.body = {
        status: 201,
        msg: '问题不存在或者没有权限'
      }
    } else {
      await Question.update(
        { description, excerpt, title }, { where }
      ).then((res) => {
        ctx.response.body = {
          status: 202,
          msg: '问题修改成功'
        }
      });
    }
  } catch (error) {
    utils.catchError(error);
  }
}

module.exports = {
  'POST /questions': createQuestion,
  'PUT /questions': updateQuestion
}