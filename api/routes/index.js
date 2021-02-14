const router = require('express').Router()
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Network = mongoose.model('Network')

router.use('/users', require('./users'))
router.use('/networks', require('./networks'))
router.use('/authors', require('./authors'))
router.use('/species', require('./species'))
router.use('/seeds', require('./seeds'))
router.use('/groups', require('./groups'))
router.use('/seeds_houses', require('./seeds_houses'))
router.use('/collection_areas', require('./collection_areas'))
router.use('/seeds_matrixes', require('./seeds_matrixes'))
router.use('/potentials', require('./potentials'))
router.use('/requests', require('./requests'))
router.use('/orders', require('./orders'))
router.use('/collections', require('./collections'))
router.use('/lots', require('./lots'))
router.use('/stock_in', require('./stock_in'))
router.use('/stock_out', require('./stock_out'))
router.use('/stock', require('./stock'))
router.use('/collector', require('./collector'))
router.use('/uploads', require('./uploads'))
router.use('/export', require('./export'))

router.post('/login', function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json('Insira um nome de usuário ou email')
  }

  if (!req.body.password) {
    return res.status(422).json('Insira sua senha')
  }

  passport.authenticate(
    'local',
    {
      session: true,
    },
    function (err, user, info) {
      if (err) {
        return next(err)
      }

      if (user) {
        user.token = user.generateJWT()
        return res.json(user.toAuthJSON())
      } else {
        return res.status(422).json('Usuário ou senha inválidos')
      }
    }
  )(req, res, next)
})

router.get('/me', function (req, res) {
  if (req.payload) {
    User.findById(req.payload.id)
      .populate('network')
      .exec(function (err, user) {
        if (!err && user) {
          res.send(user)
        } else {
          res.status(422).send('Usuário não encontrado')
        }
      })
  } else {
    res.status(422).send('Usuário não logado')
  }
})

router.post('/logout', function (req, res) {
  return res.json(true)
})

router.get('/init', function (req, res) {
  User.find({
    role: 'super',
  }).exec(function (err, users) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err)
    } else if (users && users.length === 0) {
      const xingu = new Network()
      xingu.name = 'Rede de Sementes do Xingu'
      xingu.slug = 'xingu'

      if (req.query.env && req.query.env === 'development') {
        xingu.domain_name = 'localhost:3000'
      } else {
        xingu.domain_name = 'xingu.sementesdoxingu.org.br'
      }

      xingu.save()

      const cerrado = new Network()
      cerrado.name = 'Rede de Sementes do Cerrado'
      cerrado.slug = 'cerrado'
      cerrado.domain_name = 'cerrado.sementesdoxingu.org.br'
      cerrado.save()

      const user = new User()

      user.name = 'Administrador do sistema'
      user.nickname = 'Super usuário'
      user.username = 'super'
      user.email = 'superuser@sementesdoxingu.org.br'
      user.role = 'super'

      user.setPassword('zyY5TeRl8k')

      user
        .save()
        .then(function () {
          return res.send(user)
        })
        .catch((e) => {
          return res.send(e)
        })
    } else {
      res.send('Admin já cadastrado')
    }
  })
})

router.get('/is_alive', function (req, res) {
  User.count().exec(function (err) {
    if (!err) {
      res.send('yep')
    }
  })
})

router.use(function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message

        return errors
      }, {}),
    })
  }

  return next(err)
})

module.exports = router
