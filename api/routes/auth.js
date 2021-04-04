import '../config/passport'
import passport from 'passport'
const router = require('express').Router()

router.get('/github', passport.authenticate('github'))

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=true' }),
  function (req, res) {
    res.redirect('/login')
  }
)

router.get('/me', function (req, res) {
  res.send(req.user)
})

router.post('/me', function (req, res) {
  res.send(req.user)
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
      function (err, user, info) {
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

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
