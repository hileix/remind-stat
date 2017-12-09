'use strict'

const express = require('express')
const router = express.Router()
const model = require('../models/model')
const moment = require('moment')

/* 创建任务 */
router.post('/create', async function (req, res) {
  try {
    const result = await model.createTask({
      name: req.body.name,
      time: req.body.time,
      created: moment().unix(),
      modified: moment().unix()
    })
    res.apiSuccess(result)
  } catch (e) {
    res.apiFail(`${e.name}:${e.message}`)
  }
})

/* 申请延时 */
router.post('/delay', async function (req, res) {
  try {
    const result = await model.delayTask({
      taskId: req.body.taskId,
      delayRank: req.body.delayRank,
      delayTime: req.body.delayTime,
      created: moment().unix(),
      modified: moment().unix()
    })
    res.apiSuccess(result)
  } catch (e) {
    res.apiFail(`${e.name}:${e.message}`)
  }
})

/* 完成任务 */
router.post('/finish', async function (req, res) {
  try {
    const result = await model.finishTask({
      taskId: req.body.taskId,
      allTime: req.body.allTime,
      delayCount: req.body.delayCount,
      modified: moment().unix()
    })
    res.apiSuccess(result)
  } catch (e) {
    res.apiFail(`${e.name}:${e.message}`)
  }
  res.apiSuccess()
})

module.exports = router