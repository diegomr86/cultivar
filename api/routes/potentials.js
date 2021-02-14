const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const Potential = mongoose.model('Potential')

router.get('/', auth.collectorOrAbove, (req, res) => {
  const query = {}

  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters)

    if (filters.group) {
      query.group = filters.group
    }
    if (filters.collector) {
      query.collector = filters.collector
    }

    if (filters.seed) {
      query.seed = filters.seed
    }

    if (filters.from) {
      query.createdAt = {
        $gt: new Date(filters.from),
      }
    }
    if (filters.to) {
      const date = new Date(new Date(filters.to).getTime() + 86400000)
      if (query.createdAt) {
        query.createdAt.$lte = date
      } else {
        query.createdAt = {
          $lte: date,
        }
      }
    }
    if (!filters.from && !filters.to && filters.year) {
      const year = new Date(filters.year)
      const nextYear = new Date((Number(filters.year) + 1).toString())
      query.createdAt = {
        $gte: year,
        $lt: nextYear,
      }
    }
  }

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }
  if (auth.hasRole(req, 'collector')) {
    query.collector = req.payload.id
  }

  Potential.find(query)
    .populate(populate(req))
    .sort({
      createdAt: -1,
    })
    .exec(function (err, potentials) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(potentials)
      }
    })
})

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Potential.findOne(query)
    .populate('seed')
    .populate(populate(req))
    .exec(function (err, potential) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(potential)
      }
    })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newPotential = new Potential(req.body)

  newPotential.network = req.payload.network

  newPotential.qtd = Number(newPotential.qtd)
  newPotential.save(function (err, potential) {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(potential)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const potential = req.body
  potential.qtd = Number(potential.qtd)

  const query = { _id: req.params.id, network: req.payload.network }

  Potential.findOneAndUpdate(
    query,
    {
      $set: potential,
    },
    {
      upsert: true,
    },
    function (err, potential) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(potential)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Potential.findOneAndRemove(query, function (err, potential) {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(potential)
    }
  })
})

module.exports = router
