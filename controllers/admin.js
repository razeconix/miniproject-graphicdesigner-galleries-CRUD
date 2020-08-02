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
  const sql = 'select * from gallery'
  pool.query(sql, (error, gallery, fields) => {
    if (error) throw error

    const context = { gallery, user: req.session.user }
    res.render('admin', context)
  })
})


router.get('/create', function (req, res) {
  res.render('admin_create')
})

router.post('/create', function (req, res) {
  // 1. Get data from form

  const projectname = req.body.projectname
  const projecttype = req.body.projecttype
  const fontformat1 = req.body.fontformat1
  const fontformat2 = req.body.fontformat2
  const fontformat3 = req.body.fontformat3
  const projectowner = req.body.projectowner 
  const img_url = req.body.img_url

  // 2. Create data in gallery table
  const sql = 'insert into gallery (projectname, projecttype, fontformat1, fontformat2, fontformat3,projectowner,img_url) values (?, ?, ?, ?, ?, ?, ? )'
  const params = [projectname, projecttype, fontformat1, fontformat2,fontformat3,projectowner,img_url]
  pool.query(sql, params, (error, gallery, fields) => {
    if (error) throw error

    
    // 3. Redirect to admin page
    res.redirect('/admin')
  })
})

router.get('/:id', function (req, res) {
  const id = req.params.id

  const sql = 'select * from gallery where id = ?'
  const params = [id]
  pool.query(sql, params, (error, gallery, fields) => {
    if (error) throw error

    if (gallery.length == 0) {
      res.send('Error: not found')
    }
    else {
      
      const context = gallery[0]
      res.render('admin_edit', context)
    }
  })
})

router.post('/:id', function (req, res) {
  const id = req.params.id

  // 1. Get data from form
  const projectname = req.body.projectname
  const projecttype = req.body.projecttype
  const fontformat1 = req.body.fontformat1
  const fontformat2 = req.body.fontformat2
  const fontformat3 = req.body.fontformat3
  const projectowner = req.body.projectowner 
  const img_url = req.body.img_url

  // 2. Create data in gallery table
  const sql = 'update gallery set projectname=?, projecttype=?, fontformat1=?, fontformat2=?, fontformat3=?,projectowner=?,img_url=? where id = ?'
  const params = [projectname, projecttype, fontformat1, fontformat2, fontformat3,projectowner,img_url, id]
  pool.query(sql, params, (error) => {
    if (error) throw error

    // 3. Redirect to admin page
    res.redirect('/admin')
  })
})


router.get('/:id/delete', function (req, res) {
  const id = req.params.id

  const sql = 'select * from gallery where id = ?'
  const params = [id]
  pool.query(sql, params, (error, gallery, fields) => {
    if (error) throw error
    if (gallery.length == 0) {
      res.send('Error: not found')
    }
    else {
      const context = gallery[0]
      res.render('admin_delete', context)
    }
  })
})

router.post('/:id/delete', function (req, res) {
  const id = req.params.id
  const sql = 'delete from gallery where id = ?'
  const params = [id]
  pool.query(sql, params, (error) => {
    if (error) throw error
    res.redirect('/admin')
  })
})

module.exports = router
