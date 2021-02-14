const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const axios = require('axios')
const Network = mongoose.model('Network')
const User = mongoose.model('User')
const Seed = mongoose.model('Seed')
const SeedsHouse = mongoose.model('SeedsHouse')
const Group = mongoose.model('Group')
const Collection = mongoose.model('Collection')
const CollectionArea = mongoose.model('CollectionArea')
const SeedsMatrix = mongoose.model('SeedsMatrix')
const Potential = mongoose.model('Potential')
const Request = mongoose.model('Request')
const Order = mongoose.model('Order')
const StockIn = mongoose.model('StockIn')
const StockOut = mongoose.model('StockOut')
const Lot = mongoose.model('Lot')

router.get('/import', async function (req, res) {
  const networks = await Network.find()
  const result = {}
  for (const network of networks) {
    const data = {}
    data.users = await importData('users', 'User', network)
    data.seeds = await importData('seeds', 'Seed', network)
    data.seeds_houses = await importData('seeds_houses', 'SeedsHouse', network)
    data.groups = await importData('groups', 'Group', network)
    data.collections = await importData('collections', 'Collection', network)
    data.collection_areas = await importData(
      'collection_areas',
      'CollectionArea',
      network
    )
    data.seeds_matrixes = await importData(
      'seeds_matrixes',
      'SeedsMatrix',
      network
    )
    data.potentials = await importData('potentials', 'Potential', network)
    data.requests = await importData('requests', 'Request', network)
    data.orders = await importData('orders', 'Order', network)
    data.stock_ins = await importData('stock_ins', 'StockIn', network)
    data.stock_outs = await importData('stock_outs', 'StockOut', network)
    data.lots = await importData('lots', 'Lot', network)
    result[network.name] = data
  }
  res.json(result)
})

const importData = async (type, model, network) => {
  const url = 'https://' + network.domain_name + '/api/export/' + type
  const agent = new https.Agent({
    rejectUnauthorized: false,
  })
  const list = await axios.get(url, { httpsAgent: agent })
  const result = []
  for (const item of list.data) {
    const Model = mongoose.model(model)
    const newModel = new Model(item)
    if (model === 'User') {
      newModel.network = network._id
      if (newModel.username === 'admin') {
        newModel.username = 'admin' + network.slug
        newModel.email = newModel.username + '@sementesdoxingu.org.br'
      }
    } else {
      newModel.network = network._id
    }
    const user = await newModel.save()
    result.push(user)
  }
  return result
}

router.get('/users', async function (req, res) {
  const list = await User.find()
  res.json(list)
})

router.get('/seeds', async function (req, res) {
  const list = await Seed.find()
  res.json(list)
})

router.get('/seeds_houses', async function (req, res) {
  const list = await SeedsHouse.find()
  res.json(list)
})

router.get('/groups', async function (req, res) {
  const list = await Group.find()
  res.json(list)
})

router.get('/collections', async function (req, res) {
  const list = await Collection.find()
  res.json(list)
})

router.get('/collection_areas', async function (req, res) {
  const list = await CollectionArea.find()
  res.json(list)
})

router.get('/seeds_matrixes', async function (req, res) {
  const list = await SeedsMatrix.find()
  res.json(list)
})

router.get('/potentials', async function (req, res) {
  const list = await Potential.find()
  res.json(list)
})

router.get('/requests', async function (req, res) {
  const list = await Request.find()
  res.json(list)
})

router.get('/orders', async function (req, res) {
  const list = await Order.find()
  res.json(list)
})

router.get('/stock_ins', async function (req, res) {
  const list = await StockIn.find()
  res.json(list)
})

router.get('/stock_outs', async function (req, res) {
  const list = await StockOut.find()
  res.json(list)
})

router.get('/lots', async function (req, res) {
  const list = await Lot.find()
  res.json(list)
})

module.exports = router
