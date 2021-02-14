const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const Lot = mongoose.model('Lot')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  Lot.find(query)
    .populate(populate(req))
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

router.get('/:code', auth.managerOrAbove, (req, res) => {
  const query = { code: req.params.code, network: req.payload.network }
  Lot.findOne(query)
    .populate(populate(req))
    .exec(function (err, lot) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        res.json(lot)
      }
    })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newLot = new Lot(req.body)
  newLot.network = req.payload.network
  newLot.code = newLot.code.toUpperCase()
  newLot.save(function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(seed)
    }
  })
})

module.exports = router
