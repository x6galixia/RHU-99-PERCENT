const express = require('express')
const app = express()
const pool = require('./models/localdb')
const path = require('path')
const passport = require('passport')
require('dotenv').config()
const cors = require('cors')
const session = require('express-session')
const flash = require('express-flash')
const initializePassport = require('./passportConfig')

//-- ROUTES -->
const loginRouter = require('./routes/login')

pool.connect()
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database:', err))

initializePassport(passport)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(flash())

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    next()
  })

app.use('/login', loginRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is up and running in port ${process.env.PORT}`)
})