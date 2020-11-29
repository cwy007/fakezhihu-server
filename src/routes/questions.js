const model = require('../models');
const { questions: Question, answers: Answer } = model;
const utils = require('../lib/utils');
const { userAttributes, questionAttributes, answerAttributes } = require('../config/default');

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
    console.log('问题', questionExist)
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

// 分开查询，易于修改，推荐使用分开查询，易于维护
const getQuestionMethod1 = async (ctx, next) => {
  const { questionId } = ctx.query;
  const questionWhere = { id: questionId };
  const questionInclude = [{
    model: model.users,
    attributes: userAttributes,
    as: 'author'
  }];
  const answerWhere = { targetId: questionId };
  const answerInclude = [{
    model: model.users,
    attributes: userAttributes,
    as: 'author'
  }, {
    model: model.statuses,
    as: 'status',
    where: { targetType: 2 } // 文章0、问题1、答案2
  }]

  try {
    const questionContent = await Question.findOne({
      where: questionWhere,
      include: questionInclude,
      attributes: questionAttributes
    });

    // 使用分开查询时，记得在顶部将 Answer 引入
    const answerList = await Answer.findAndCountAll({
      where: answerWhere,
      include: answerInclude,
      attributes: answerAttributes
    })
    questionContent.dataValues.answers = answerList.rows;

    ctx.response.body = {
      status: 200,
      content: questionContent
    }
  } catch (error) {
    utils.catchError(error);
    ctx.resError = error;
  }
}

// 使用关联查询
const getQuestionMethod2 = async (ctx, next) => {
  const { questionId } = ctx.query;
  const questionWhere = { id: questionId };
  const include = [{
    model: model.users,
    attributes: userAttributes,
    as: 'author'
  }, {
    model: model.answers,
    as: 'answers',
    required: false,
    attributes: answerAttributes,
    include: [{
      model: model.statuses,
      as: 'status',
      where: { targetType: 2 }
    }, {
      model: model.users,
      attributes: userAttributes,
      as: 'author'
    }]
  }]

  try {
    const questionContent = await Question.findOne({
      where: questionWhere,
      include: include,
      attributes: questionAttributes
    });

    ctx.response.body = {
      status: 200,
      content: questionContent
    }
  } catch (error) {
    utils.catchError(error);
  }
}

module.exports = {
  'POST /questions': createQuestion,
  'PUT /questions': updateQuestion,
  'GET /questions': getQuestionMethod1
}