const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const categoriasDeMatrizes = require('../../data/categorias-de-matrizes.json')
const Seed = mongoose.model('Seed')
const StockIn = mongoose.model('StockIn')
const StockOut = mongoose.model('StockOut')
const Potential = mongoose.model('Potential')
const Collection = mongoose.model('Collection')
const CollectionArea = mongoose.model('CollectionArea')
const SeedsMatrix = mongoose.model('SeedsMatrix')
const Network = mongoose.model('Network')

router.get('/', auth.managerOrAbove, async (req, res) => {
  let movements = await getMovements(req, res, req.query.filters)
  movements = JSON.parse(JSON.stringify(movements))

  movements = movements.map((movement) => {
    movement.type = movement.out_mode ? 'stock_out' : 'stock_in'

    if (
      movement.qtd &&
      movement.movement_type === 'stock_out' &&
      movement.qtd > 0
    ) {
      movement.qtd = movement.qtd * -1
    }
    return movement
  })
  movements = movements
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reverse()

  res.json(movements)
})

router.get('/filters', auth.managerOrAbove, async (req, res) => {
  const movements = await getMovements(req, res)
  const loaded = {}
  const filters = {
    seeds_houses: [],
    seeds: [],
    groups: [],
    collectors: [],
    buyers: [],
    lots: [],
  }

  movements.forEach((movement) => {
    if (movement.seeds_house && !loaded[movement.seeds_house._id]) {
      filters.seeds_houses.push({
        id: movement.seeds_house._id,
        title: movement.seeds_house.name,
        description: movement.seeds_house.code,
      })
      loaded[movement.seeds_house._id] = true
    }
    if (movement.seed && !loaded[movement.seed._id]) {
      filters.seeds.push({
        id: movement.seed._id,
        title: movement.seed.name,
        description: movement.seed.scientific_name,
        price: movement.seed.price || '',
        wholesale_price: movement.seed.price || '',
      })
      loaded[movement.seed._id] = true
    }
    if (movement.group && !loaded[movement.group._id]) {
      filters.groups.push({
        id: movement.group._id,
        title: movement.group.name,
      })
      loaded[movement.group._id] = true
    }
    if (movement.collector && !loaded[movement.collector._id]) {
      filters.collectors.push({
        id: movement.collector._id,
        title: movement.collector.name,
      })
      loaded[movement.collector._id] = true
    }
    if (movement.buyer && !loaded[movement.buyer._id]) {
      filters.buyers.push({
        id: movement.buyer._id,
        title: movement.buyer.name,
      })
      loaded[movement.buyer._id] = true
    }
    if (movement.lot && !loaded[movement.lot._id]) {
      filters.lots.push({
        id: movement.lot._id,
        title: movement.lot.code,
      })
      loaded[movement.lot._id] = true
    }
  })

  res.json(filters)
})

router.get('/label-and-term/filters', auth.managerOrAbove, async (req, res) => {
  const movements = await getMovements(req, res, { type: 'stock_out' })
  const loaded = {}
  const filters = {
    buyers: [],
    orders: [],
  }

  movements.forEach((movement) => {
    if (movement.buyer && !loaded[movement.buyer._id]) {
      filters.buyers.push({
        id: movement.buyer._id,
        title: movement.buyer.name,
      })
      loaded[movement.buyer._id] = true
    }

    if (movement.order && !loaded[movement.order._id]) {
      filters.orders.push({
        id: movement.order._id,
        title: 'Encomenda #' + movement.order.code,
      })
      loaded[movement.order._id] = true
    }
  })

  res.json(filters)
})

router.get('/print-term', auth.managerOrAbove, async (req, res) => {
  let ret = []
  const query = { network: req.payload.network }

  if (req.query.filters && Array.isArray(req.query.filters)) {
    query._id = { $in: req.query.filters }

    ret = await StockOut.find(query)
      .populate('network')
      .populate('seed', 'name scientific_name')
      .populate('lot', 'code')
      .exec()
  }

  res.json(ret)
})

router.get(
  '/print-production-trade-report',
  auth.managerOrAbove,
  async (req, res) => {
    let loaded = []
    const query = { network: req.payload.network }

    if (req.query.filters) {
      const year = parseInt(req.query.filters)

      // filtro: para obter o estoque no ano atual, que é adicionado ao filtro pela rede (network)
      query.createdAt = {
        $gte: new Date(new Date(year, 0, 1).setHours(0, 0, 0)),
        $lte: new Date(new Date(year, 11, 31).setHours(23, 59, 59)),
      }

      // agregação: para obter o saldo do ano anterior
      const aggregateLastYear = [
        {
          $match: {
            network: query.network,
            createdAt: {
              $lte: new Date(new Date(year - 1, 12, 31).setHours(23, 59, 59)),
            },
          },
        },
        {
          $group: {
            _id: '$seed',
            qtd: { $sum: '$qtd' },
          },
        },
      ]

      // recupera as entradas no estoque da rede em anos anteriores (TODO: melhorar isso, para obter o valor diretamento de uma tabela)
      const stockInLastYearList = await StockIn.aggregate(aggregateLastYear)

      // recupera as saídas do estoque da rede em anos anteriores (TODO: melhorar isso, para obter o valor diretamento de uma tabela)
      const stockOutLastYearList = await StockOut.aggregate(aggregateLastYear)

      // recupera as entradas no estoque da rede no ano
      const stockInList = await StockIn.find(query)
        .populate('network')
        .populate('seed', 'name scientific_name renasem')
        .exec()

      // recupera as saídas do estoque da rede no ano
      const stockOutList = await StockOut.find(query)
        .populate('network')
        .populate('seed', 'name scientific_name renasem')
        .exec()

      // recupera as áreas de coleta da rede
      const collectionAreaList = await CollectionArea.find(query).exec()

      // recupera as matrizes de sementes da rede
      const seedsMatrixList = await SeedsMatrix.find(query).exec()

      // preenche o cabeçalho
      if (stockInList.length > 0 || stockOutList.length > 0) {
        const network =
          stockInList.length > 0
            ? stockInList[0].network
            : stockOutList[0].network
        const networkCity =
          network && network.address ? network.address.city : ''

        loaded = {
          network_id: network._id,
          network_name: network.name,
          network_renasem: network.renasem,
          networkCity,
          details: [],
        }
      }

      // preenche a lista as entradas no estoque
      stockInList.forEach((stockIn) => {
        const areas = collectionAreaList.filter((area) =>
          area.group.equals(stockIn.group)
        )
        const matriz = seedsMatrixList.find((mtx) =>
          mtx.group.equals(stockIn.group)
        )
        let nomeCategoria = ''
        if (matriz) {
          const categoria = categoriasDeMatrizes.find(
            (cat) => cat.value === matriz.category
          )
          if (categoria) {
            nomeCategoria = categoria.text
          }
        }

        let item = loaded.details.find((det) =>
          det.seed_id.equals(stockIn.seed._id)
        )
        if (!item) {
          item = {
            cities: [],
            seed_id: stockIn.seed._id,
            seed_scientific_name: stockIn.seed.scientific_name,
            seed_name: stockIn.seed.name,
            seed_category: nomeCategoria,
            last_year_balance: 0.0,
            commercialization: 0.0,
            production: 0.0,
            others: 0.0,
            balance: 0.0,
            next_year_forecast: 0.0,
          }
          loaded.details.push(item)
        }

        // preenche os Municípios da Coleta da Semente
        if (areas && areas.length > 0) {
          areas.forEach((area) => {
            if (!item.cities.find((city) => city === area.address.city)) {
              item.cities.push(area.address.city)
            }
          })
        }

        // atualiza a quantidade de entradas no estoque (produção)
        item.production += stockIn.qtd
      })

      // preenche a lista as saídas do estoque
      stockOutList.forEach((stockOut) => {
        const commercialization =
          stockOut.out_mode === 'Venda Atacado' ||
          stockOut.out_mode === 'Venda Varejo'
            ? stockOut.qtd
            : 0
        const others =
          stockOut.out_mode !== 'Venda Atacado' &&
          stockOut.out_mode !== 'Venda Varejo'
            ? stockOut.qtd
            : 0

        let item = loaded.details.find((x) =>
          x.seed_id.equals(stockOut.seed._id)
        )
        if (item) {
          item.commercialization +=
            stockOut.out_mode === 'Venda Atacado' ||
            stockOut.out_mode === 'Venda Varejo'
              ? stockOut.qtd
              : 0
          item.others +=
            stockOut.out_mode !== 'Venda Atacado' &&
            stockOut.out_mode !== 'Venda Varejo'
              ? stockOut.qtd
              : 0
        } else {
          item = {
            cities: [],
            seed_id: stockOut.seed._id,
            seed_scientific_name: stockOut.seed.scientific_name,
            seed_name: stockOut.seed.name,
            seed_category: '',
            last_year_balance: 0.0,
            production: 0.0,
            commercialization,
            others,
            balance: 0.0,
            next_year_forecast: 0.0,
          }
          loaded.details.push(item)
        }
      })

      for (let i = 0; i < loaded.details.length; i++) {
        const item = loaded.details[i]

        // cálculo do saldo no ano anterior
        const stockIn = stockInLastYearList.find((stockIn) =>
          stockIn._id.equals(item.seed_id)
        )
        const stockOut = stockOutLastYearList.find((stockOut) =>
          stockOut._id.equals(item.seed_id)
        )
        item.last_year_balance =
          (stockIn ? stockIn.qtd : 0) - (stockOut ? stockOut.qtd : 0)

        // cálculo do Saldo
        item.balance =
          item.last_year_balance +
          item.production -
          item.commercialization -
          item.others

        // previsão de produção para o próximo Ano
        const potentials = await Potential.find({
          network: loaded.network_id,
          seed: item.seed_id,
          createdAt: {
            $gte: new Date(new Date(year, 1, 1).setHours(0, 0, 0)),
            $lte: new Date(new Date(year, 12, 31).setHours(23, 59, 59)),
          },
        }).exec()

        potentials.forEach((potential) => {
          item.next_year_forecast += potential.qtd
        })

        // arredonda para duas casas decimais
        item.production =
          Math.round((item.production + Number.EPSILON) * 100) / 100
        item.commercialization =
          Math.round((item.commercialization + Number.EPSILON) * 100) / 100
        item.others = Math.round((item.others + Number.EPSILON) * 100) / 100
        item.last_year_balance =
          Math.round((item.last_year_balance + Number.EPSILON) * 100) / 100
        item.balance = Math.round((item.balance + Number.EPSILON) * 100) / 100
        item.next_year_forecast =
          Math.round((item.next_year_forecast + Number.EPSILON) * 100) / 100
      }
    }

    res.json(loaded)
  }
)

router.get(
  '/print-declaration-of-seeds-source-report',
  auth.managerOrAbove,
  async (req, res) => {
    let loaded = {}
    const query = { network: req.payload.network }

    if (req.query.filters) {
      // filtros
      const filters = JSON.parse(req.query.filters)
      const year = parseInt(filters.year)
      query.createdAt = {
        $lte: new Date(new Date(year, 11, 31).setHours(23, 59, 59)),
      }

      // recupera as saídas do estoque da rede no ano
      const network = await Network.findById(query.network)

      // recupera as matrizes de sementes da rede
      const seedsMatrixList = await SeedsMatrix.find(query)
        .populate('collection_area')
        .exec()

      // recupera as áreas de coleta da rede
      const collectionAreaList = await CollectionArea.find(query).exec()

      // preenche o cabeçalho
      const networkCity = network && network.address ? network.address.city : ''

      loaded = {
        network_id: network._id,
        network_name: network.name,
        network_renasem: network.renasem,
        networkCity,
        responsible_technician_name: network.responsible_technician
          ? network.responsible_technician.name
          : '',
        responsible_technician_renasem: network.responsible_technician
          ? network.responsible_technician.renasem
          : '',
        matrixes: [],
        collection_areas: [],
      }

      // preenche a lista as matrizes
      seedsMatrixList.forEach((seedsMatrix) => {
        const collectionArea = seedsMatrix.collection_area
        const collectionAreaCity =
          collectionArea && collectionArea.address
            ? collectionArea.address.city
            : ''

        if (!filters.city || filters.city === collectionAreaCity) {
          loaded.matrixes.push({
            city: collectionAreaCity,
            code: seedsMatrix.code,
            scientific_name: seedsMatrix.scientific_name,
            name: seedsMatrix.name,
            category: seedsMatrix.category,
            source: seedsMatrix.source,
            geolocation: seedsMatrix.geolocation,
            collec_months: seedsMatrix.collec_months,
          })
        }
      })

      // preenche a lista as áreas de coleta
      collectionAreaList.forEach((collectionArea) => {
        const seedsMatrix = seedsMatrixList.find((matrix) =>
          matrix.collection_area._id.equals(collectionArea._id)
        )
        const collectionAreaCity = collectionArea.address
          ? collectionArea.address.city
          : ''

        if (!filters.city || filters.city === collectionAreaCity) {
          loaded.collection_areas.push({
            estimated_area: collectionArea.estimated_area,
            city: collectionAreaCity,
            scientific_name: seedsMatrix ? seedsMatrix.scientific_name : '',
            name: seedsMatrix ? seedsMatrix.name : '',
            source: seedsMatrix ? seedsMatrix.source : '',
            collec_months: seedsMatrix ? seedsMatrix.collec_months : [],
          })
        }
      })
    }

    res.json(loaded)
  }
)

router.get('/summary', auth.managerOrAbove, async (req, res) => {
  const summary = {}
  let total = 0

  const movements = await getMovements(req, res, req.query.filters)
  if (movements) {
    movements.forEach((movement) => {
      if (movement.seed) {
        if (!summary[movement.seed._id]) {
          summary[movement.seed._id] = {
            qtd: 0,
            price: 0,
            wholesale_price: 0,
            compensation_collect: 0,
            total: 0,
          }
        }

        summary[movement.seed._id].price = movement.seed.price
        summary[movement.seed._id].wholesale_price =
          movement.seed.wholesale_price
        summary[movement.seed._id].compensation_collect =
          movement.seed.compensation_collect

        if (!movement.out_mode) {
          summary[movement.seed._id].qtd += movement.qtd
          total += movement.qtd
        } else {
          summary[movement.seed._id].qtd -= movement.qtd
          total -= movement.qtd
        }
      }
    })
  }
  res.json({ summary, total })
})

router.get('/collector/filters', auth.managerOrAbove, async (req, res) => {
  const movements = await getMovements(req, res)
  const loaded = {}
  const filters = {
    groups: [],
    seeds: [],
  }

  movements.forEach((movement) => {
    if (movement.group && !loaded[movement.group._id]) {
      filters.groups.push({
        id: movement.group._id,
        title: movement.group.name,
      })
      loaded[movement.group._id] = true
    }

    if (movement.seed && !loaded[movement.seed._id]) {
      filters.seeds.push({
        id: movement.seed._id,
        title: movement.seed.name,
        description: movement.seed.scientific_name,
      })
      loaded[movement.seed._id] = true
    }
  })

  res.json(filters)
})

router.get('/collector', auth.managerOrAbove, async (req, res) => {
  let stocks = []

  // ***** monta os filtros *****
  const query = {}
  const filters = JSON.parse(req.query.filters)

  // por rede de sementes
  if (!auth.isSuper(req)) {
    query.network = req.payload.network
  }

  // por grupo de coletores
  if (filters.group) {
    query.group = filters.group
  }

  // por semente
  if (filters.seed) {
    query.seed = filters.seed
  }

  // ***** monta os dados de estoque dos coletores *****

  // lista as "entradas" no estoque dos coletores, que são as "coletas" deles
  let stockIns = await Collection.find(query)
    .populate('seed', 'name')
    .populate('group', 'name')
    .populate('collector', 'group')
    .exec()

  // remove atributos que não são enviados ao client
  stockIns = JSON.parse(JSON.stringify(stockIns))

  // soma as entradas no estoque do coletor
  stockIns.forEach((stockIn) => {
    const group =
      stockIn.group || (stockIn.collector ? stockIn.collector.group : null)

    if (group) {
      const stock = stocks.find(
        (stock) =>
          stock.group._id === group._id && stock.seed._id === stockIn.seed._id
      )

      if (stock) {
        stocks.qtd += stockIn.weight_benef || 0 // sempre o "peso beneficiado"
      } else {
        stocks.push({
          group,
          seed: stockIn.seed,
          qtd: stockIn.weight_benef || 0, // sempre o "peso beneficiado"
        })
      }
    }
  })

  // lista as "saídas" do estoque dos coletores, que são as "entradas" no estoque da rede de sementes
  let stockOuts = await StockIn.find(query)
    .populate('seed', 'name')
    .populate('group', 'name')
    .exec()

  // remove atributos que não são enviados ao client
  stockOuts = JSON.parse(JSON.stringify(stockOuts))

  // subtrai as entradas pelas saídas
  stocks.forEach((stock) => {
    const stockOutsFiltered = stockOuts.filter(
      (stockOut) =>
        stockOut.group._id === stock.group._id &&
        stockOut.seed._id === stock.seed._id
    )

    stockOutsFiltered.forEach((stockOut) => {
      stock.qtd -= stockOut.qtd
    })
  })

  // ordena os dados
  stocks = stocks.sort(
    (a, b) => a.group.name - b.group.name || a.seed.name - b.seed.name
  )

  res.json(stocks)
})

const getMovements = async function (req, res, filters = {}) {
  const query = { network: req.payload.network }

  if (filters) {
    if (typeof filters === 'string') {
      filters = JSON.parse(filters)
    }
  } else {
    filters = {}
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
    query.createdAt = { $gte: year, $lt: nextYear }
  }
  if (filters.seeds_house) {
    query.seeds_house = filters.seeds_house
  }
  if (filters.seed) {
    query.seed = filters.seed
  }
  if (filters.lot) {
    query.lot = filters.lot
  }
  let stockIns = []
  if (!filters.type || filters.type === 'stock_in') {
    if (filters.group) {
      query.group = filters.group
    }
    if (filters.collector) {
      query.collector = filters.collector
    }

    stockIns = await StockIn.find(query)
      .populate('seeds_house', 'name code')
      .populate(
        'seed',
        'name scientific_name price wholesale_price compensation_collect'
      )
      .populate('lot', 'code')
      .populate('group', 'name')
      .populate('collector', 'name')
      .exec()
  }

  let stockOuts = []
  if (!filters.type || filters.type === 'stock_out') {
    if (filters.out_mode) {
      query.out_mode = filters.out_mode
    }
    if (filters.buyer) {
      query.buyer = filters.buyer
    }
    if (filters.order) {
      query.order = filters.order
    }

    stockOuts = await StockOut.find(query)
      .populate('seeds_house', 'name')
      .populate('seed', 'name scientific_name price wholesale_price')
      .populate('lot', 'code')
      .populate('buyer', 'name')
      .populate('order', 'code')
      .exec()
  }

  return stockOuts.concat(stockIns)
}

router.post('/', auth.managerOrAbove, (req, res) => {
  const newStockIn = new StockIn(req.body)
  newStockIn.network = req.payload.network

  newStockIn.save(function (err, stockIn) {
    if (err) {
      res.status(422).send('Ocorreu um erro ao salvar: ' + err.message)
    } else {
      Seed.findOne({
        _id: stockIn.seed,
      }).exec(function (err, seed) {
        if (err) {
          res
            .status(422)
            .send('Ocorreu um erro ao salvar o item: ' + err.message)
        } else {
          seed.stock += stockIn.qtd
          seed.save()
          res.json(stockIn)
        }
      })
    }
  })
})

module.exports = router
