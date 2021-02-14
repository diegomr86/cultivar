let $axios

export function setAxios(axios) {
  $axios = axios
}

const get = async function (url, params) {
  return await $axios.$get(url, { params })
}

const getCollectors = async function () {
  return await $axios.$get('users', {
    params: {
      role: 'collector',
    },
  })
}

const getClients = async function () {
  return await $axios.$get('users', {
    params: {
      role: 'client',
    },
  })
}

const getStock = async function (filters) {
  return await $axios.$get('stock', { params: { filters } })
}

const getStockFilters = async function () {
  return await $axios.$get('stock/filters')
}

const getLabelAndTermStockFilters = async function () {
  return await $axios.$get('stock/label-and-term/filters')
}

const getStockSummary = async function (filters) {
  return await $axios.$get('stock/summary', { params: { filters } })
}

const getLabelAndTerm = async function (filters) {
  return await $axios.$get('stock/print-term', { params: { filters } })
}

const getProductionTradeReport = async function (filters) {
  return await $axios.$get('stock/print-production-trade-report', {
    params: { filters },
  })
}

const getDeclarationOfSeedsSourceReport = async function (filters) {
  return await $axios.$get('stock/print-declaration-of-seeds-source-report', {
    params: { filters },
  })
}

const loadList = async function (type, params) {
  if (type === 'collectors') {
    return await getCollectors()
  } else if (type === 'clients') {
    return await getClients()
  } else if (type === 'stock') {
    return await getStock(params)
  } else if (type === 'stock_filters') {
    return await getStockFilters()
  } else if (type === 'label_and_term_stock_filters') {
    return await getLabelAndTermStockFilters()
  } else if (type === 'stock_summary') {
    return await getStockSummary(params)
  } else if (type === 'label_and_term') {
    return await getLabelAndTerm(params)
  } else if (type === 'print_production_trade_report') {
    return await getProductionTradeReport(params)
  } else if (type === 'print_declaration_of_seeds_source_report') {
    return await getDeclarationOfSeedsSourceReport(params)
  } else {
    return await get(type, params)
  }
}

export default {
  loadList,
}
