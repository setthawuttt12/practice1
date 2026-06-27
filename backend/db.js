const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'1234',
    database:'pjs',
    dateStrings: true,
    timezone: "+07:00",
})

module.exports = pool.promise()