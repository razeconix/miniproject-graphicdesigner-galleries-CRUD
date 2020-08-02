const mysql = require('mysql')
var express = require('express')
var router = express.Router()

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'sswp'
});

router.get('/', function (req, res) {
  res.render('login')
})

router.post('/', function (req, res) {
  // 1. Get data from form
  const username = req.body.username
  const password = req.body.password

  // 2. Check that it matches a user in the database
  const sql = 'select * from users where username = ? AND password = sha1(?)'
  const params = [username, password]
  pool.query(sql, params, (error, users) => {
    if (error) throw error
    if (users.length == 0) {
      // Incorrect - show error
      const errorMessage = 'Username/password is incorrect'
      const context = { username, errorMessage }
      res.render('login', context)
    }
    else {
      // Correct - save the user in the session
      req.session.user = users[0]
      res.redirect('/admin')
    }
  })
})

module.exports = router
