const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const utils = require('../config/utils')
const Request = mongoose.model('Request')
const StockIn = mongoose.model('StockIn')

router.get('/requests', auth.collectorOrAbove, (req, res) => {
  const items = {}

  const query = {
    network: req.payload.network,
    $or: [
      {
        collector: req.payload.id,
      },
      {
        'qtd.collector': req.payload.id,
      },
    ],
  }

  Request.find(query, 'collector')
    .populate('seed')
    .exec(function (err, requests) {
      if (!err) {
        const q = { collector: req.payload.id, network: req.payload.network }
        StockIn.find(q).exec(function (err, stockIns) {
          requests.forEach((request) => {
            const totalQtd = utils.sumQtd(
              request,
              request.collector,
              req.payload.id
            )
            if (totalQtd) {
              const seedId = request.seed._id
              if (items[seedId]) {
                items[seedId].qtd += utils.sumQtd(
                  request,
                  request.collector,
                  req.payload.id
                )
              } else {
                let qtdDelivered = 0
                if (stockIns && stockIns.length) {
                  qtdDelivered = stockIns
                    .map((stockIn) => {
                      if (stockIn.seed.toString() === seedId.toString()) {
                        return stockIn.qtd
                      } else {
                        return 0
                      }
                    })
                    .reduce((a, b) => a + b, 0)
                }

                items[seedId] = {
                  seed: request.seed,
                  qtd: totalQtd,
                  compensation_collect: request.compensation_collect,
                  qtdDelivered,
                }
              }
              items[seedId].qtd_remaining =
                items[seedId].qtd - items[seedId].qtdDelivered
            }
          })
          if (err) {
            res
              .status(422)
              .send('Ocorreu um erro ao carregar a lista: ' + err.message)
          } else {
            res.json(Object.values(items))
          }
        })
      }
    })
})

router.get('/stockIns', auth.collectorOrAbove, (req, res) => {
  const query = { collector: req.payload.id, network: req.payload.network }
  StockIn.find(query, utils.select(req))
    .populate(utils.populate(req))
    .exec(function (err, stockIns) {
      if (err) {
        res
          .status(422)
          .send('Ocorreu um erro ao carregar a lista: ' + err.message)
      } else {
        res.json(stockIns)
      }
    })
})

module.exports = router
