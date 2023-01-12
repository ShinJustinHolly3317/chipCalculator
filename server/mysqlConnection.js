// Connect to db
const mysql = require('mysql2')

const dbNameConfig = {
  dev: process.env.SQL_DATABASE, // for localhost development
  production: process.env.SQL_DATABASE, // for Ec2 machine
  test: process.env.SQL_DATABASE_TEST // for integration test
}

const db = mysql.createPool({
  connectionLimit: 10,
  host: dbNameConfig.production || 'localhost',
  port: 3306,
  user: 'appworks-student',
  password: 'Appworks456.',
  database: 'chipmaster',
  multipleStatements: true
})

db.getConnection(function (err, connection) {
  if (err) throw err // not connected!
  console.log('Mysql connected..!!')
})
const dbPromise = db.promise()

module.exports = dbPromise
