import './database'

import path from 'path'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import routes from './routes'

const app = express()
const secret = process.env.SECRET || process.env.npm_package_name

app.use(
  session({
    secret,
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: false,
  })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')

app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(cors())

module.exports = {
  path: '/api',
  handler: app,
}
