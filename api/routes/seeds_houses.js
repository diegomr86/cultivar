const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const SeedsHouse = mongoose.model('SeedsHouse')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  SeedsHouse.find(query)
    .populate(populate(req))
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

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  SeedsHouse.findOne(query)
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
  const newSeedsHouse = new SeedsHouse(req.body)
  newSeedsHouse.code = newSeedsHouse.code.toUpperCase()

  newSeedsHouse.network = req.payload.network

  newSeedsHouse.save(function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(seed)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  const body = req.body
  if (body.code) {
    body.code = body.code.toUpperCase()
  }
  SeedsHouse.findOneAndUpdate(
    query,
    {
      $set: body,
    },
    {
      upsert: true,
    },
    function (err, newSeedsHouse) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(newSeedsHouse)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  SeedsHouse.findOne(query)
    .populate('lots stock_ins stock_outs')
    .exec(function (err, seedsHouse) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else if (seedsHouse.stock_ins && seedsHouse.stock_ins.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem entradas no estoque cadastradas para esta casa de sementes'
          )
      } else if (seedsHouse.stock_outs && seedsHouse.stock_outs.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem saídas do estoque cadastradas para esta casa de sementes'
          )
      } else if (seedsHouse.lots && seedsHouse.lots.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem lotes relacionados a esta casa de sementes: (' +
              seedsHouse.lots.map((p) => p.code).join(', ') +
              ')'
          )
      } else {
        seedsHouse.remove()
        res.send(seedsHouse)
      }
    })
})

module.exports = router
