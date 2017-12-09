'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/* 中间件 */
/* app.use(bodyParser.raw({
  type: 'text/xml'
})) */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./middlewares/output')())

/* 路由 */
app.use('/task', require('./routes/route'))

/* 监听端口 */
app.listen('3041', (err) => {
  if (err) {
    console.log('监听端口失败')
  }
  console.log('正在监听')
})