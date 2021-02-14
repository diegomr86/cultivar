const mongoose = require('mongoose')
const router = require('express').Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const User = mongoose.model('User')

router.get('/', auth.managerOrAbove, function (req, res) {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  if (req.query.role && req.query.role !== 'user') {
    query.role = req.query.role
  }

  User.find(query)
    .populate(populate(req))
    .sort('name')
    .exec(function (err, users) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao carregar a lista: ' + err)
      } else {
        res.json(users)
      }
    })
})

router.get('/:id', auth.managerOrAbove, function (req, res, next) {
  const query = { _id: req.params.id }
  if (req.payload.role !== 'super') {
    query.network = req.payload.network
  }
  User.findOne(query)
    .populate(populate(req))
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401)
      }
      return res.json(user)
    })
    .catch(next)
})

router.post('/', auth.managerOrAbove, function (req, res, next) {
  const user = new User()

  user.network = req.payload.network

  user.username = req.body.username
  user.email = req.body.email
  user.name = req.body.name
  user.nickname = req.body.nickname
  user.cpf = req.body.cpf
  user.contact = req.body.contact
  user.image = req.body.image
  user.address = req.body.address
  user.bank_account = req.body.bank_account
  user.group = req.body.group

  if (req.payload.role === 'admin' || req.payload.role === 'super') {
    user.role = req.body.role
  } else if (req.body.role !== 'admin' && req.body.role !== 'super') {
    user.role = req.body.role
  }

  user.setPassword(req.body.password)

  user
    .save()
    .then(function () {
      return res.send(user)
    })
    .catch(next)
})

router.put('/:id', auth.managerOrAbove, function (req, res, next) {
  const query = { _id: req.params.id }
  if (req.payload.role !== 'super') {
    query.network = req.payload.network
  }
  User.findOne(query).then(function (user) {
    user.username = req.body.username
    user.email = req.body.email
    user.name = req.body.name
    user.nickname = req.body.nickname
    user.cpf = req.body.cpf
    user.contact = req.body.contact
    user.image = req.body.image
    user.address = req.body.address
    user.bank_account = req.body.bank_account
    user.group = req.body.group

    if (req.payload.role === 'admin') {
      user.role = req.body.role
    }

    if (req.payload.role === 'super') {
      user.role = req.body.role
      user.network = req.body.network
    }

    if (req.body.password) {
      user.setPassword(req.body.password)
    }

    user
      .save()
      .then(function () {
        return res.send(user)
      })
      .catch(next)
  })
})

router.delete('/:id', auth.managerOrAbove, function (req, res) {
  const query = { _id: req.params.id, network: req.payload.network }
  User.findOne(query)
    .populate(
      'collections collection_areas requests orders potentials seeds_matrixes stock_ins stock_outs seeds_houses seeds_houses_collector'
    )
    .exec(function (err, user) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else if (req.payload.id === req.params.id) {
        res.status(422).send('Não é possível excluír você mesmo!')
      } else if (user.collections && user.collections.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem coletas cadastradas para este coletor'
          )
      } else if (user.collection_areas && user.collection_areas.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem áreas de coleta cadastradas para este coletor'
          )
      } else if (user.stock_ins && user.stock_ins.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem entradas no estoque cadastradas para este coletor'
          )
      } else if (user.stock_outs && user.stock_outs.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem saídas do estoque cadastradas para este cliente'
          )
      } else if (user.requests && user.requests.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem pedidos cadastrados para este coletor: (' +
              user.requests.map((c) => 'Pedido ' + c.code).join(', ') +
              ')'
          )
      } else if (user.potentials && user.potentials.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem listas de potencial cadastradas para este coletor: (' +
              user.potentials.map((p) => 'Lista ' + p.code).join(', ') +
              ')'
          )
      } else if (user.orders && user.orders.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem encomendas cadastradas para este coletor: (' +
              user.orders.map((p) => 'Encomenda ' + p.code).join(', ') +
              ')'
          )
      } else if (user.seeds_matrixes && user.seeds_matrixes.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem matrixes de semente relacionadas a este coletor'
          )
      } else if (user.seeds_houses && user.seeds_houses.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem casas de semente relacionados a este proprietário: (' +
              user.seeds_houses.map((p) => p.name).join(', ') +
              ')'
          )
      } else if (
        user.seeds_houses_collector &&
        user.seeds_houses_collector.length
      ) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem casas de sementes relacionadas a este coletor: (' +
              user.seeds_houses_collector.map((p) => p.name).join(', ') +
              ')'
          )
      } else {
        user.remove()
        res.send(user)
      }
    })
})
module.exports = router
