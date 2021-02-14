const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const slugify = require('slugify')
const auth = require('../config/auth')
const populate = require('../config/utils').populate
const Group = mongoose.model('Group')

router.get('/', auth.managerOrAbove, (req, res) => {
  const query = {}

  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  Group.find(query)
    .sort('name')
    .exec(function (err, groups) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar a lista: ' + err.message)
      } else {
        res.json(groups)
      }
    })
})

router.get('/search', auth.managerOrAbove, (req, res) => {
  const query = { name: req.query.name, network: req.payload.network }
  Group.findOne(query).exec(function (err, group) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao carregar o item: ' + err.message)
    } else {
      res.json(group)
    }
  })
})

router.get('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Group.findOne(query)
    .populate(populate(req))
    .exec(function (err, group) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else {
        res.json(group)
      }
    })
})

router.post('/', auth.managerOrAbove, (req, res) => {
  const newGroup = new Group(req.body)
  newGroup.slug = slugify(newGroup.name).toLowerCase()
  newGroup.network = req.payload.network
  newGroup.save(function (err, group) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(group)
    }
  })
})

router.put('/:id', auth.managerOrAbove, (req, res) => {
  const params = req.body
  params.slug = slugify(params.name).toLowerCase()
  const query = { _id: req.params.id, network: req.payload.network }
  Group.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
    },
    function (err, newGroup) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(newGroup)
      }
    }
  )
})

router.delete('/:id', auth.managerOrAbove, (req, res) => {
  const query = { _id: req.params.id, network: req.payload.network }
  Group.findOne(query)
    .populate(
      'collections collection_areas requests potentials seeds_matrixes stock_ins seeds_houses'
    )
    .exec(function (err, group) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else if (group.collections && group.collections.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem coletas cadastradas para este grupo'
          )
      } else if (group.collection_areas && group.collection_areas.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem áreas de coleta cadastradas para este grupo'
          )
      } else if (group.stock_ins && group.stock_ins.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem entradas no estoque cadastradas para este grupo'
          )
      } else if (group.requests && group.requests.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem pedidos para coletores cadastrados para este grupo: (' +
              group.requests.map((c) => 'Pedido ' + c.code).join(', ') +
              ')'
          )
      } else if (group.potentials && group.potentials.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem listas de potencial cadastradas para este grupo: (' +
              group.potentials.map((p) => 'Lista ' + p.code).join(', ') +
              ')'
          )
      } else if (group.seeds_matrixes && group.seeds_matrixes.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem matrixes de semente relacionadas a este grupo'
          )
      } else if (group.seeds_houses && group.seeds_houses.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem grupos de coletores relacionados a este grupo: (' +
              group.seeds_houses.map((p) => p.name).join(', ') +
              ')'
          )
      } else {
        group.remove()
        res.send(group)
      }
    })
})

module.exports = router
