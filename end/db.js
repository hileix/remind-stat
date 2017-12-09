const mysql = require('mysql')

class DB {
  constructor () {
    this.conn = mysql.createConnection({
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '1234',
      database: 'remind_stat',
      charset: 'utf8mb4'
    })
  }
  query (sql, values) {
    return this.queryWithOption({
      sql: sql,
      values: values
    })
  }
  queryWithOption (options) {
    const that = this
    return new Promise((resolve, reject) => {
      that.conn.query(options, (err, rows, fields) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}

module.exports = DB
