import Vue from 'vue'
import Vue2Filters from 'vue2-filters'

const Vue2FiltersConfig = {
  currency: {
    symbol: 'R$ ',
    decimalDigits: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
}

Vue.use(Vue2Filters, Vue2FiltersConfig)

Vue.filter('moeda', (value) => {
  return Vue.options.filters.currency(value)
})

Vue.filter('kg', (value) => {
  const kg = Vue.options.filters.currency(value, '', 3) + ' Kg'
  return kg.replace(',000', '')
})
