const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const slugify = require('slugify')
const auth = require('../config/auth')
const select = require('../config/utils').select
const populate = require('../config/utils').populate
const Seed = mongoose.model('Seed')

router.get('/', auth.collectorOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  Seed.find(query, select(req))
    .sort('name')
    .exec(function (err, seeds) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar a lista: ' + err.message)
      } else {
        res.json(seeds)
      }
    })
})

router.get('/slug', auth.collectorOrAbove, (req, res) => {
  const query = {
    slug: slugify(req.query.name).toLowerCase(),
    network: req.payload.network,
  }

  Seed.findOne(query)
    .populate(populate(req))
    .exec(function (err, seed) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        res.json(seed)
      }
    })
})

router.get('/:id', auth.collectorOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Seed.findOne(query)
    .populate(populate(req))
    .exec(function (err, seed) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        res.json(seed)
      }
    })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newSeed = new Seed(req.body)
  newSeed.slug = slugify(newSeed.name).toLowerCase()
  newSeed.network = req.payload.network
  newSeed.save(function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(seed)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const params = req.body
  params.slug = slugify(params.name).toLowerCase()
  const query = { _id: req.params.id, network: req.payload.network }
  Seed.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
    },
    function (err, newSeed) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(newSeed)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }

  Seed.findOne(query)
    .populate(
      'potentials orders requests groups collections stock_ins stock_outs'
    )
    .exec(function (err, seed) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else if (seed.stock_outs && seed.stock_outs.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem saídas de estoque desta semente'
          )
      } else if (seed.stock_ins && seed.stock_ins.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem entradas de estoque desta semente'
          )
      } else if (seed.requests && seed.requests.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem pedidos para coletores cadastrados para esta semente: (' +
              seed.requests.map((c) => 'Pedido ' + c.code).join(', ') +
              ')'
          )
      } else if (seed.orders && seed.orders.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem encomendas cadastradas para esta semente: (' +
              seed.orders.map((o) => 'Encomenda ' + o.code).join(', ') +
              ')'
          )
      } else if (seed.potentials && seed.potentials.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem listas de potencial cadastradas para esta semente: (' +
              seed.potentials.map((p) => 'Lista ' + p.code).join(', ') +
              ')'
          )
      } else if (seed.collections && seed.collections.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem coletas relacionadas a esta semente'
          )
      } else if (seed.groups && seed.groups.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem grupos de coletores relacionados a esta semente: (' +
              seed.groups.map((p) => p.name).join(', ') +
              ')'
          )
      } else {
        seed.remove()
        res.send(seed)
      }
    })
})

module.exports = router
