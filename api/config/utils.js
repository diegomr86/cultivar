module.exports = {
  populate(req) {
    let populate = req.query.populate
    if (populate) {
      if (populate && populate.search('{') !== -1) {
        populate = JSON.parse(req.query.populate)
      }
    } else {
      populate = ''
    }
    return populate
  },
  select(req) {
    let select = req.query.select
    if (select) {
      if (select && select.search('{') !== -1) {
        select = JSON.parse(req.query.select)
      }
    } else {
      select = ''
    }
    return select
  },
  sumQtd(seedItem, requestCollector, collector) {
    if (typeof seedItem.qtd === 'object') {
      if (collector) {
        return seedItem.qtd
          .map((q) => {
            return parseFloat(q.collector === collector ? q.qtd : 0)
          })
          .reduce((a, b) => a + b, 0)
      } else {
        return seedItem.qtd
          .map((q) => parseFloat(q.qtd || 0))
          .reduce((a, b) => a + b, 0)
      }
    } else if (requestCollector && requestCollector === collector) {
      return seedItem.qtd || 0
    } else {
      return 0
    }
  },
  fixQtdToNumber(obj) {
    obj.seed_items = obj.seed_items.map((seedItem) => {
      if (typeof seedItem.qtd === 'string') {
        seedItem.qtd = parseFloat(seedItem.qtd)
      }
      return seedItem
    })
  },
  sumArray(arr, prop, propToMultiply) {
    let values = []
    if (propToMultiply !== null) {
      values = arr.map((item) =>
        parseFloat(item[prop] * item[propToMultiply] || 0)
      )
    } else {
      values = arr.map((item) => parseFloat(item[prop] || 0))
    }
    if (values && values.length) {
      return values.reduce((a, b) => a + b, 0)
    } else {
      return 0
    }
  },
}
