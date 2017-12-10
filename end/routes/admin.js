'use strict'

const express = require('express')
const router = express.Router()
const model = require('../models/model')
const moment = require('moment')

/* 后台管理首页 */
router.get('/', (req, res) => {
  res.render('admin.html')
})

module.exports = router
