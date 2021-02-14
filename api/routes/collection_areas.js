const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const CollectionArea = mongoose.model('CollectionArea')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  CollectionArea.find(query)
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

router.get('/cities', auth.managerOrAbove, async (req, res) => {
  const query = {}
  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  const cities = []
  const collectionAreaList = await CollectionArea.find(query)

  collectionAreaList.forEach((collectionArea) => {
    const collectionAreaCity = collectionArea.address
      ? collectionArea.address.city
      : ''

    // evita incluir cidades duplicadas
    if (
      collectionAreaCity &&
      !cities.find((city) => city === collectionAreaCity)
    ) {
      cities.push(collectionAreaCity)
    }
  })

  res.json(cities)
})

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  CollectionArea.findOne(query)
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
  const newCollectionArea = new CollectionArea(req.body)
  newCollectionArea.network = req.payload.network
  newCollectionArea.save(function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(seed)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  CollectionArea.findOneAndUpdate(
    query,
    {
      $set: req.body,
    },
    {
      upsert: true,
    },
    function (err, newCollectionArea) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(newCollectionArea)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  CollectionArea.findOneAndRemove(query, function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message)
    } else {
      res.send(seed)
    }
  })
})

module.exports = router
