import '../config/passport'
import passport from 'passport'
const mongoose = require('mongoose')
const router = require('express').Router()
const { authenticated } = require('../config/auth')
const User = mongoose.model('User')

router.get('/user', authenticated, (req, res) => {
  User.findById(req.payload.id).exec((err, user) => {
    if (!err && user) {
      res.send(user.data())
    } else {
      res.status(422).send('Usuário não encontrado')
    }
  })
})

router.post('/login', (req, res) => {
  if (!req.body.email) {
    return res.status(422).json('Email inválido')
  }
  if (!req.body.password) {
    return res.status(422).json('Senha inválida')
  }
  try {
    passport.authenticate(
      'local',
      {
        session: true,
      },
      (err, user, info) => {
        if (err) {
          return res.status(500).json(err)
        }
        if (user) {
          user.token = user.generateJWT()
          return res.json(user.toAuthJSON())
        } else {
          return res.status(422).json(info)
        }
      }
    )(req, res)
  } catch (e) {
    return res.status(500).json(e)
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
