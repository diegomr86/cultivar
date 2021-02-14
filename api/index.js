import './database'

import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import routes from './routes'

const app = express()
const router = express.Router()
const secret = process.env.SECRET || process.env.npm_package_description

app.use(
  session({
    secret,
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: false,
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

router.use(routes)

app.use(router)

module.exports = {
  path: '/api',
  handler: app,
}
