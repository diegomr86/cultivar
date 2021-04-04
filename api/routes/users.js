const mongoose = require('mongoose')
const router = require('express').Router()
const auth = require('../config/auth')
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
      { id: req.params.id },
    ],
  }
  User.find(query).then((user) => {
    return res.send(user.data())
  })
})

router.get('/:id/check', (req, res) => {
  const query = {
    $or: [
      { id: req.params.id },
      { email: req.params.id },
      { phone: req.params.id },
    ],
  }
  User.find(query).then((user) => {
    return res.send({ name: user.name, picture: user.picture })
  })
})

router.post('/register', (req, res, next) => {
  const user = new User()

  user.email = req.body.email
  user.phone = req.body.phone
  user.name = req.body.name
  user.picture = req.body.picture
  user.role = 'user'

  user.setPassword(req.body.password)

  user
    .save()
    .then(() => {
      return res.send(user.data())
    })
    .catch(next)
})

router.put('/profile', auth.authenticated, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    user.email = req.body.email
    user.phone = req.body.phone
    user.name = req.body.name
    user.picture = req.body.picture

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

module.exports = router
