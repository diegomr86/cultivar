const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const slugify = require('slugify')
const auth = require('../config/auth')
const select = require('../config/utils').select
const populate = require('../config/utils').populate
const Specie = mongoose.model('Specie')

router.get('/', (req, res) => {
  const query = {}

  if (req.query.search) {
    query.$or = [
      { code: { $regex: req.query.search, $options: 'i' } },
      { scientific_name: { $regex: req.query.search, $options: 'i' } },
      { local_name: { $regex: req.query.search, $options: 'i' } },
    ]
  }
  if (
    req.query.already_tested_in_direct_seedin !== undefined &&
    req.query.already_tested_in_direct_seedin !== null
  ) {
    query.already_tested_in_direct_seedin =
      req.query.already_tested_in_direct_seedin
  }
  if (req.query.vegetation_type) {
    query.vegetation_types = req.query.vegetation_type
  }
  if (req.query.presence) {
    query.presence = req.query.presence
  }
  if (req.query.cycle) {
    query.cycle = req.query.cycle
  }

  Specie.find(query, select(req))
    .populate(populate(req))
    .populate(
      'seed_conservations.author seed_processings.author seed_storages.author seed_collectings.author'
    )
    .sort('scientific_name')
    .exec(function (err, species) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(species)
      }
    })
})

router.get('/:id', (req, res) => {
  const query = { slug: req.params.id }
  Specie.findOne(query)
    .populate(
      'seed_conservations.author seed_processings.author seed_storages.author seed_collectings.author'
    )
    .exec(function (err, specie) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(specie)
      }
    })
})

router.post('/', auth.super, (req, res) => {
  const newSpecie = new Specie(req.body)
  newSpecie.slug = slugify(
    newSpecie.scientific_name.split(' ').slice(0, 2).join(' ')
  ).toLowerCase()
  newSpecie.save(function (err, specie) {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(specie)
    }
  })
})

router.put('/:id', auth.super, (req, res) => {
  const params = req.body
  params.slug = slugify(
    params.scientific_name.split(' ').slice(0, 2).join(' ')
  ).toLowerCase()
  const query = { slug: req.params.id }
  Specie.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
    },
    function (err, newSpecie) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(newSpecie)
      }
    }
  )
})

router.delete('/:id', auth.super, (req, res) => {
  const query = { slug: req.params.id }

  Specie.findOne(query)
    .populate('seeds')
    .exec(function (err, specie) {
      if (err) {
        res.status(422).send(err.message)
      } else if (specie.seeds && specie.seeds.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem sementes relacionadas a esta espécie'
          )
      } else {
        specie.remove()
        res.send(specie)
      }
    })
})

module.exports = router
