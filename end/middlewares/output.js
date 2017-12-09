'use strict'

module.exports = function () {
  return function (req, res, next) {
    res.apiSuccess = function (jsonData={}, message='请求成功', ) {
      res.json({ code: 1, message: message, data: jsonData })
      return
    }
    res.apiFail = function (message='请求失败') {
      res.json({ code: 0, message: message })
      return
    }
    next()
  }
}
