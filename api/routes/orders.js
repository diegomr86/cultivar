const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const fixQtdToNumber = require('../config/utils').fixQtdToNumber
const Order = mongoose.model('Order')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters)

    if (filters.client) {
      query.client = filters.client
    }

    if (filters.year) {
      const year = new Date(filters.year)
      const nextYear = new Date((Number(filters.year) + 1).toString())
      query.createdAt = {
        $gte: year,
        $lt: nextYear,
      }
    }
  }
  Order.find(query)
    .populate(populate(req))
    .sort({ code: -1 })
    .exec(function (err, orders) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar a lista: ' + err.message)
      } else {
        res.json(orders)
      }
    })
})

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Order.findOne(query)
    .populate('seed_items.seed')
    .populate(populate(req))
    .exec(function (err, order) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        order.seed_items = order.seed_items.sort(function (a, b) {
          return a.seed.name.localeCompare(b.seed.name)
        })
        res.json(order)
      }
    })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newOrder = new Order(req.body)

  const query = {}
  Order.find(query)
    .sort({
      code: -1,
    })
    .limit(1)
    .exec(function (err, latest) {
      if (!err) {
        if (latest && latest.length) {
          newOrder.code = latest[0].code + 1
        } else {
          newOrder.code = 1
        }

        fixQtdToNumber(newOrder)

        newOrder.network = req.payload.network
        newOrder.save(function (err, order) {
          if (err) {
            res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
          } else {
            res.send(order)
          }
        })
      }
    })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const order = req.body

  fixQtdToNumber(order)

  const query = { _id: req.params.id, network: req.payload.network }

  Order.findOneAndUpdate(
    query,
    {
      $set: order,
    },
    {
      upsert: true,
    },
    function (err, newOrder) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(newOrder)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Order.findOneAndRemove(query, function (err, order) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message)
    } else {
      res.send(order)
    }
  })
})

module.exports = router
