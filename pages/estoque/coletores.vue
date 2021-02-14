<template>
  <div class="stock">
    <breadcrumb active="Estoque dos coletores" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Estoque dos coletores</h1>
          </div>
          <div class="col-sm-6 main-actions">
            <a
              v-if="showClearButton"
              class="btn btn-default btn-sm"
              @click="clearFilters"
            >
              Limpar filtros
            </a>
          </div>
        </div>
        <div class="info-content">
          <div class="filters gray">
            <b-form-group label="Filtrar por:">
              <div class="row">
                <div class="col-sm-4">
                  <filter-entity-select
                    v-model="filters.seed"
                    type="seeds"
                    placeholder="Semente"
                    @selected="applyFilters"
                  />
                </div>
                <div class="col-sm-4">
                  <filter-entity-select
                    v-model="filters.group"
                    type="groups"
                    placeholder="Grupo de coletores"
                    @selected="applyFilters"
                  />
                </div>
              </div>
            </b-form-group>
          </div>
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!stocks && !error && filtered"
            msg="Carregando estoques"
          />
          <div v-if="stocks && !stocks.length">
            <p class="alert alert-warning text-center">
              Nenhum estoque encontrado
            </p>
          </div>
          <div v-if="stocks && stocks.length">
            <table class="table b-table b-table-stacked-md">
              <thead>
                <tr>
                  <th>Grupo de Coletores</th>
                  <th>Semente</th>
                  <th>Estoque</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(stock, i) in stocks">
                  <tr v-if="stock.qtd > 0" :key="i">
                    <td>
                      <span>
                        <a
                          v-if="stock.group"
                          @click="setFilter('group', stock.group._id)"
                        >
                          {{ stock.group.name }}
                        </a>
                      </span>
                    </td>
                    <td>
                      <span>
                        <a
                          v-if="stock.seed"
                          class="inline"
                          @click="setFilter('seed', stock.seed._id)"
                        >
                          {{ stock.seed.name }}
                        </a>
                        <span v-if="stock.seed_name">
                          {{ stock.seed_name }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span>{{ stock.qtd | kg }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
              <!-- eslint-disable-next-line -->
              <tfoot>
                <tr class="b-table-bottom-row">
                  <td />
                  <td><strong> Total</strong></td>
                  <td>
                    <strong>{{ total_qtd | kg }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'
export default {
  name: 'StockCollectors',
  components: {
    Loading,
    Breadcrumb,
    FilterEntitySelect,
  },

  data() {
    return {
      stocks: null,
      filtered: false,
      filters: {
        group: null,
        seed: null,
      },
      total_qtd: 0,
    }
  },
  computed: {
    showClearButton() {
      return Object.keys(this.filters).find((k) => this.filters[k])
    },
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      this.applyFilters()
    },
    onFiltered() {
      if (this.stocks) {
        this.total_qtd = 0
        this.stocks.forEach((item) => {
          if (item.qtd > 0) {
            this.total_qtd += item.qtd
          }
        })
      }
    },
    setFilter(field, value) {
      this.filters[field] = value
      this.applyFilters()
    },
    async applyFilters() {
      this.stocks = null
      this.stocks = await this.loadList('stock/collector', {
        filters: this.filters,
      })
      this.filtered = true
      this.onFiltered()
    },
    clearFilter(filter) {
      this.filters[filter] = null
      this.applyFilters()
    },
    clearFilters() {
      Object.keys(this.filters).forEach((filter) => {
        this.filters[filter] = null
      })
      this.applyFilters()
    },
  },
}
</script>
