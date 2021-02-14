const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const SeedsMatrix = mongoose.model('SeedsMatrix')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  SeedsMatrix.find(query)
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

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  SeedsMatrix.findOne(query)
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
  const newSeedsMatrix = new SeedsMatrix(req.body)
  newSeedsMatrix.network = req.payload.network
  newSeedsMatrix.save(function (err, seed) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(seed)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  SeedsMatrix.findOneAndUpdate(
    query,
    {
      $set: req.body,
    },
    {
      upsert: true,
    },
    function (err, newSeedsMatrix) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(newSeedsMatrix)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  SeedsMatrix.findOneAndRemove(query, function (err, seedMatrix) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao excluír: ' + err.message)
    } else {
      res.send(seedMatrix)
    }
  })
})

module.exports = router
