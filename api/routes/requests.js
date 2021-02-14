const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const Request = mongoose.model('Request')

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

  Request.find(query)
    .populate(populate(req))
    .sort({
      createdAt: -1,
    })
    .exec(function (err, requests) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(requests)
      }
    })
})

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Request.findOne(query)
    .populate('seed')
    .populate(populate(req))
    .exec(function (err, request) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(request)
      }
    })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newRequest = new Request(req.body)

  newRequest.network = req.payload.network

  newRequest.qtd = Number(newRequest.qtd)
  newRequest.save(function (err, request) {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(request)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const request = req.body
  request.qtd = Number(request.qtd)

  const query = { _id: req.params.id, network: req.payload.network }

  Request.findOneAndUpdate(
    query,
    {
      $set: request,
    },
    {
      upsert: true,
    },
    function (err, request) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(request)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Request.findOneAndRemove(query, function (err, request) {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(request)
    }
  })
})

module.exports = router
