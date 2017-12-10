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

// 设置静态文件目录
app.use(express.static('../public'))

// 使用模板引擎
app.set('views', '../')
app.engine('.html', require('ejs').__express)
app.set('view engine', 'html')

app.use(require('./middlewares/output')())

/* 路由 */
app.use('/task', require('./routes/user'))
app.use('/admin', require('./routes/admin'))

/* 监听端口 */
app.listen('3041', (err) => {
  if (err) {
    console.log('监听端口失败')
  }
  console.log('正在监听 3041 端口')
})