const mysql = require('mysql')

module.exports = (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'sswp'
  })

  connection.connect()
  const sql = 'select * from gallery'
  connection.query(sql, (error, gallery, fields) => {
    if (error) throw error

    const context = { gallery, user: req.session.user }
    res.render('home', context)
  })
  
  connection.end()

}

