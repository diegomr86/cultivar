const mongoose = require('mongoose')
const router = require('express').Router()
const { authenticated } = require('../config/auth')
const User = mongoose.model('User')

// router.get('/', auth.admin, (req, res) => {
//   const query = {}

//   User.find(query).exec((err, users) => {
//     if (err) {
//       res.status(422).send(err.response.data)
//     } else {
//       res.json(users.map((user) => user.data()))
//     }
//   })
// })

router.get('/:id', (req, res) => {
  const query = {
    $or: [
      { id: req.params.id },
      { email: req.params.id },
      { phone: req.params.id },
      { username: req.params.id },
    ],
  }
  User.findOne(query).then((user) => {
    if (user) {
      return res.send(user.data())
    } else {
      return res.status(422).send('Usuário não encontrado')
    }
  })
})

router.get('/:id/find_or_create', (req, res) => {
  const query = {
    $or: [
      { username: req.params.id },
      { email: req.params.id },
      { phone: req.params.id },
    ],
  }
  User.findOne(query).then(async (user) => {
    if (user) {
      return res.send(user.data())
    } else {
      user = new User({ status: 'pending_password', role: 'member' })
      const userName = req.params.id
      if (userName.includes('@')) {
        user.email = userName
      } else if (!isNaN(formatPhone(userName))) {
        user.phone = formatPhone(userName)
      } else {
        user.username = userName
      }
      await user.save()
      res.send(user.data())
    }
  })
})

router.post('/set_password', authenticated, (req, res) => {
  if (!req.body.password) {
    return res.status(422).json('Senha inválida')
  }

  User.findById(req.user.id).exec((err, user) => {
    if (!err && user) {
      if (user.status === 'pending_password') {
        user.setPassword(req.body.password)
        user.status = 'pending_profile'
        user.save()
        res.send(user.data())
      }
    } else {
      res.status(422).send('Usuário não encontrado')
    }
  })
})

router.put('/profile', authenticated, (req, res, next) => {
  User.findById(req.user.id).then((user) => {
    user.email = req.body.email
    user.phone = req.body.phone
    user.username = req.body.username
    user.name = req.body.name
    user.picture = req.body.picture
    user.status = 'registered'

    if (req.body.password) {
      user.setPassword(req.body.password)
    }

    user
      .save()
      .then(() => {
        return res.send(user.data())
      })
      .catch(next)
  })
})

const formatPhone = (phone) => {
  return phone
    .replace('(', '')
    .replace(')', '')
    .replace('-', '')
    .replace('.', '')
    .replace(' ', '')
}

module.exports = router
