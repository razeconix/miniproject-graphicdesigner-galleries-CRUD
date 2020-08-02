const express = require('express')
const mustache = require('mustache-express')
const session = require('express-session')

const app = express()

// Setup views
app.engine('html', mustache())
app.set('view engine', 'html')

// Setup static
app.use(express.static('static'))

// Setup post
app.use(express.urlencoded({ extended: false }))

// Setup sessions
app.use(session({ 
    secret: 'superheroesarecool',
    resave: false,
    saveUninitialized: true
}))

// Middleware
const isAuthenticated = require('./middleware/isAuthenticated')




// Routes
app.get('/', require('./controllers/home'))
app.use('/filter', require('./controllers/home'))
app.use('/admin', isAuthenticated, require('./controllers/admin'))
app.use('/login', require('./controllers/login'))
app.get('/logout', require('./controllers/logout'))

// Serve the app
app.listen(8080, () => console.log('Listening...'))
