import './database'

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

passport.serializeUser((user, done) => {
  console.log('serializeUser')
  console.log(user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log('deserializeUser')
  console.log(user)
  done(null, user)
})

require('./config/passport')

app.use(routes)

app.use(cors())

module.exports = {
  path: '/api',
  handler: app,
}
