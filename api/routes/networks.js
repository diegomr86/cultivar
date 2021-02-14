const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const slugify = require('slugify')
const auth = require('../config/auth')
const Network = mongoose.model('Network')

router.get('/', auth.super, function (req, res) {
  Network.find({}).exec(function (err, networks) {
    if (err) {
      res
        .status(422)
        .send('Ocorreu um erro ao carregar a lista: ' + err.message)
    } else {
      res.json(networks)
    }
  })
})

router.get('/current', auth.authenticated, async function (req, res) {
  if (req.payload.network) {
    return res.json(await Network.findById(req.payload.network))
  }
  res.sendStatus(401)
})

router.get('/:id', function (req, res, next) {
  const query = { _id: req.params.id }
  Network.findOne(query)
    .then(function (network) {
      if (!network) {
        return res.sendStatus(401)
      }
      let address = { uf: '', city: '', postal_code: '', address: '' }
      if (network.address) {
        address = network.address
      }

      let responsibleTechnician = {
        name: '',
        cnpj: '',
        crea: '',
        renasem: '',
        contact: '',
        email: '',
      }
      if (network.responsible_technician) {
        responsibleTechnician = network.responsible_technician
      }

      if (!responsibleTechnician.address) {
        responsibleTechnician.address = {
          uf: '',
          city: '',
          postal_code: '',
          address: '',
        }
      }

      const ret = {
        _id: network.id,
        name: network.name,
        slug: network.slug,
        cnpj: network.cnpj,
        renasem: network.renasem,
        image: network.image,
        contact: network.contact,
        description: network.description,
        domain_name: network.domain_name,
        address,
        responsibleTechnician,
      }

      return res.json(ret)
    })
    .catch(next)
})

router.post('/', auth.super, function (req, res) {
  const newNetwork = new Network()
  newNetwork.name = req.body.name
  newNetwork.slug = slugify(newNetwork.name).toLowerCase()
  newNetwork.cnpj = req.body.cnpj
  newNetwork.renasem = req.body.renasem
  newNetwork.contact = req.body.contact
  newNetwork.description = req.body.description
  newNetwork.domain_name = req.body.domain_name
  newNetwork.image = req.body.image
  newNetwork.address = req.body.address
  newNetwork.responsible_technician = req.body.responsible_technician

  newNetwork.save(function (err, network) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      res.send(network)
    }
  })
})

router.put('/:id', auth.super, function (req, res) {
  const query = { _id: req.params.id }
  Network.findOne(query).then(function (network) {
    network.name = req.body.name
    network.slug = slugify(network.name).toLowerCase()
    network.cnpj = req.body.cnpj
    network.renasem = req.body.renasem
    network.domain_name = req.body.domain_name
    network.image = req.body.image
    network.address = req.body.address
    network.contact = req.body.contact
    network.description = req.body.description

    if (req.body.responsible_technician) {
      network.responsible_technician = {
        name: req.body.responsible_technician.name,
        cnpj: req.body.responsible_technician.cnpj,
        crea: req.body.responsible_technician.crea,
        renasem: req.body.responsible_technician.renasem,
        contact: req.body.responsible_technician.contact,
        email: req.body.responsible_technician.email,
      }

      if (
        req.body.responsible_technician.address &&
        req.body.responsible_technician.address.address
      ) {
        network.responsible_technician.address = {
          uf: req.body.responsible_technician.address.uf,
          city: req.body.responsible_technician.address.city,
          postal_code: req.body.responsible_technician.address.postal_code,
          address: req.body.responsible_technician.address.address,
        }
      }
    }

    network.save(function (err, network) {
      if (err) {
        res.status(422).send('Ocorreu um erro ao atualizar: ' + err.message)
      } else {
        res.send(network)
      }
    })
  })
})

router.delete('/:id', auth.super, function (req, res) {
  Network.findOne({
    _id: req.params.id,
  })
    .populate(
      'users seeds seeds_houses groups collections collection_areas seeds_matrixes potentials requests stock_ins'
    )
    .exec(function (err, network) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar o item: ' + err.message)
      } else if (network.users && network.users.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem usuários cadastrados nesta rede'
          )
      } else if (network.seeds && network.seeds.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem sementes cadastradas nesta rede'
          )
      } else if (network.seeds_houses && network.seeds_houses.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem casas de sementes cadastradas nesta rede: (' +
              network.seeds_houses.map((p) => p.name).join(', ') +
              ')'
          )
      } else if (network.groups && network.groups.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem grupos de coletores cadastradas nesta rede: (' +
              network.seeds_houses.map((p) => p.name).join(', ') +
              ')'
          )
      } else if (network.collections && network.collections.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem coletas cadastradas nesta rede'
          )
      } else if (network.collection_areas && network.collection_areas.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem áreas de coleta cadastradas nesta rede'
          )
      } else if (network.seeds_matrixes && network.seeds_matrixes.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem matrizes de sementes relacionadas nesta rede'
          )
      } else if (network.potentials && network.potentials.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem listas de potencial cadastradas nesta rede: (' +
              network.potentials.map((p) => 'Lista ' + p.code).join(', ') +
              ')'
          )
      } else if (network.requests && network.requests.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem pedidos para coletores cadastrados nesta rede: (' +
              network.requests.map((c) => 'Pedido ' + c.code).join(', ') +
              ')'
          )
      } else if (network.orders && network.orders.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem encomendas cadastradas nesta rede'
          )
      } else if (network.stock_ins && network.stock_ins.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem entradas no estoque cadastradas nesta rede'
          )
      } else if (network.stock_outs && network.stock_outs.length) {
        res
          .status(422)
          .send(
            'Não é possível excluír! Existem saídas do estoque cadastradas nesta rede'
          )
      } else if (network.lots && network.lots.length) {
        res
          .status(422)
          .send('Não é possível excluír! Existem lotes cadastrados nesta rede')
      } else {
        network.remove()
        res.send(network)
      }
    })
})

module.exports = router
