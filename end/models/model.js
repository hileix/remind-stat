'use strict'

const DB = require('../db')

module.exports = {
  // 创建任务
  createTask: async function (data) {
    try {
      let sql = `insert into task (name, first_time, created, modified) values ("${data.name}", ${data.time}, ${data.created}, ${data.modified})`
      console.log(sql)
      return await (new DB).query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 申请延时
  delayTask: async function (data) {
    try {
      let sql = `insert into delay (task_id, delay_rank, delay_time, created, modified) values (${data.taskId}, ${data.delayRank}, ${data.delayTime}, ${data.created}, ${data.modified})`
      console.log(sql)
      return await (new DB).query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 完成任务
  finishTask: async function (data) {
    try {
      let sql  = `update task set all_time=${data.allTime}, delay_count=${data.delayCount}, modified=${data.modified} where task_id=${data.taskId}`
      console.log(sql)
      return await (new DB).query(sql)
    } catch (e) {
      throw new Error(e)
    }
  }
}