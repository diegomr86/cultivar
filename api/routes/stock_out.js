const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const Seed = mongoose.model('Seed')
const StockOut = mongoose.model('StockOut')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  StockOut.find(query).exec(function (err, stockOuts) {
    if (err) {
      res
        .status(422)
        .send('Ocorreu um erro ao carregar a lista: ' + err.message)
    } else {
      res.json(stockOuts)
    }
  })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newStockOut = new StockOut(req.body)

  const query = { _id: newStockOut.seed, network: req.payload.network }

  Seed.findOne(query).exec(function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      if (newStockOut.out_mode === 'Venda Varejo') {
        newStockOut.price = seed.price
      } else if (newStockOut.out_mode === 'Venda Atacado') {
        newStockOut.price = seed.wholesale_price
      } else {
        newStockOut.price = 0
      }
      newStockOut.network = req.payload.network
      newStockOut.save(function (err, stockOut) {
        if (err) {
          res
            .status(422)
            .send('Ocorreu um erro ao salvar o item: ' + err.message)
        } else {
          seed.stock += stockOut.qtd
          seed.save()
          res.json(stockOut)
        }
      })
    }
  })
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  StockOut.findOneAndRemove(query, function (err, stockOut) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message)
    } else {
      res.send(stockOut)
    }
  })
})

module.exports = router
