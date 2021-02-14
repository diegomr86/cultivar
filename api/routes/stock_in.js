const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const Lot = mongoose.model('Lot')
const StockIn = mongoose.model('StockIn')

router.get('/', auth.collectorOrAbove, (req, res) => {
  const query = {}

  const filters = JSON.parse(req.query.filters)

  if (filters.year) {
    const year = new Date(filters.year)
    const nextYear = new Date((Number(filters.year) + 1).toString())
    query.createdAt = {
      $gte: year,
      $lt: nextYear,
    }
  }

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  if (auth.hasRole(req, 'collector')) {
    query.collector = req.payload.id
  }

  StockIn.find(query).exec(function (err, stockIns) {
    if (err) {
      res
        .status(422)
        .send('Ocorreu um erro ao carregar a lista: ' + err.message)
    } else {
      res.json(stockIns)
    }
  })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newStockIn = new StockIn(req.body)

  newStockIn.network = req.payload.network
  newStockIn.save(function (err, stockIn) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar o item: ' + err.message)
    } else {
      res.json(stockIn)
    }
  })
})

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  StockIn.findOne(query)
    .populate(populate(req))
    .exec(function (err, stockIn) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        res.json(stockIn)
      }
    })
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  StockIn.findOneAndRemove(query, function (err, stockIn) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message)
    } else {
      res.send(stockIn)
    }
  })
})

router.post('/import', auth.managerOrAbove, (req, res) => {
  const logs = []
  const query = { network: req.payload.network }
  Lot.find(query).exec(function (err, lots) {
    if (err) {
      res
        .status(422)
        .send('Ocorreu um erro ao carregar os lotes: ' + err.message)
    } else {
      req.body.forEach((item) => {
        logs.push(saveLot(req, res, item, lots))
      })
    }
  })
})

const saveLot = (req, res, item, lots) => {
  const code = item.lot
  if (lots[code]) {
    item.lot = lots[code]
    return saveItem(req, res, item)
  } else {
    const newLot = new Lot({
      code,
      seeds_house: item.seeds_house,
      seed: item.seed,
      seed_name: item.seed_name,
    })
    newLot.network = req.payload.network
    newLot.save(function (err, lot) {
      if (err) {
        // eslint-disable-next-line
        console.log('Ocorreu um erro ao salvar: ' + err.message);
      } else {
        lots[code] = lot._id
        item.lot = lot._id
        return saveItem(req, res, item)
      }
    })
  }
}
const saveItem = (req, res, item) => {
  const newStockIn = new StockIn(item)
  newStockIn.network = req.payload.network
  newStockIn.save(function (err, stockIn) {
    if (err) {
      // eslint-disable-next-line
      console.log(err);
      return err
    } else {
      return stockIn
    }
  })
}

module.exports = router
