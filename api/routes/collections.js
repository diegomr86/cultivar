const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const populate = require('../config/utils').populate
const auth = require('../config/auth')
const Collection = mongoose.model('Collection')

router.get('/', auth.collectorOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  if (auth.isCollectorOrAbove(req) && !auth.isManagerOrAbove(req)) {
    query.collector = req.payload.id
  }

  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters)

    if (filters.year) {
      const year = new Date(filters.year)
      const nextYear = new Date((Number(filters.year) + 1).toString())
      query.createdAt = {
        $gte: year,
        $lt: nextYear,
      }
    }
  }

  Collection.find(query)
    .populate(populate(req))
    .exec(function (err, collections) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar a lista: ' + err.message)
      } else {
        res.json(collections)
      }
    })
})

router.get('/:id', auth.collectorOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Collection.findOne(query)
    .populate(populate(req))
    .exec(function (err, collection) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        res.json(collection)
      }
    })
})

router.post('/', auth.collectorOrAbove, (req, res) => {
  const newCollection = new Collection(req.body)
  if (auth.isCollectorOrAbove(req) && !auth.isManagerOrAbove(req)) {
    newCollection.collector = req.payload.id
  }
  newCollection.network = req.payload.network

  newCollection.save(function (err, collection) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(collection)
    }
  })
})

router.put('/:id', auth.collectorOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }

  if (auth.isCollectorOrAbove(req) && !auth.isManagerOrAbove(req)) {
    query.collector = req.payload.id
  }

  Collection.findOneAndUpdate(
    query,
    {
      $set: req.body,
    },
    {
      upsert: true,
    },
    function (err, collection) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(collection)
      }
    }
  )
})

router.delete('/:id', auth.collectorOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }

  if (auth.isCollectorOrAbove(req) && !auth.isManagerOrAbove(req)) {
    query.collector = req.payload.id
  }

  Collection.findOneAndRemove(query, function (err, collection) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message)
    } else {
      res.send(collection)
    }
  })
})

module.exports = router
