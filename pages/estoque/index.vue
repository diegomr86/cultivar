<template>
  <div class="stock">
    <breadcrumb active="Estoque" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Estoque</h1>
          </div>
          <div class="col-sm-6 main-actions">
            <a
              v-if="showClearButton"
              class="btn btn-default btn-sm"
              @click="clearFilters"
            >
              Limpar filtros
            </a>
            <a
              v-if="(movements && movements.length) || stock_summary"
              class="btn btn-primary btn-sm"
              @click="downloadXLS"
            >
              <i class="fa fa-download" /> Exportar
            </a>
            <a
              v-if="(movements && movements.length) || stock_summary"
              class="btn btn-primary btn-sm"
              @click="print()"
            >
              <i class="fa fa-print" /> Imprimir
            </a>
            <n-link
              v-if="(movements && movements.length) || stock_summary"
              to="/estoque/etiqueta-e-termo-conformidade"
              class="btn btn-primary btn-sm"
            >
              <i class="fa fa-print" /> Etiqueta e Termo
            </n-link>
            <n-link to="/estoque/entrada" class="btn btn-primary btn-sm">
              <i class="fa fa-plus" /> Entrada
            </n-link>
            <n-link to="/estoque/saida" class="btn btn-primary btn-sm">
              <i class="fa fa-plus" /> Saída
            </n-link>
          </div>
        </div>
        <div class="info-content">
          <b-form-select
            v-if="!filters.from && !filters.to"
            v-model="filters.year"
            :options="years"
            class="years-filter"
            @selected="yearChanged"
          ></b-form-select>
          <b-tabs v-model="tabIndex" content-class="mt-3" changed>
            <b-tab
              title="Movimentações do estoque"
              active
              @click="applyFilters()"
            >
              <div v-if="filters_data" class="filters gray">
                <b-form-group label="Filtrar por:">
                  <div class="row">
                    <div
                      v-if="
                        filters_data.seeds_houses &&
                        filters_data.seeds_houses.length
                      "
                      class="col-sm-4"
                    >
                      <filter-entity-select
                        v-model="filters.seeds_house"
                        :items="filters_data.seeds_houses"
                        placeholder="Casa de sementes"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div
                      v-if="filters_data.seeds && filters_data.seeds.length"
                      class="col-sm-4"
                    >
                      <filter-entity-select
                        v-model="filters.seed"
                        :items="filters_data.seeds"
                        placeholder="Semente"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div
                      v-if="filters_data.lots && filters_data.lots.length"
                      class="col-sm-4"
                    >
                      <filter-entity-select
                        v-model="filters.lot"
                        :items="filters_data.lots"
                        placeholder="Lote"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div
                      v-if="
                        filters_data.groups &&
                        filters_data.groups.length &&
                        filters.type !== 'stock_out'
                      "
                      class="col-sm-4"
                    >
                      <filter-entity-select
                        v-model="filters.group"
                        :items="filters_data.groups"
                        placeholder="Grupo de coletores"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div
                      v-if="
                        filters_data.collectors &&
                        filters_data.collectors.length
                      "
                      class="col-sm-4"
                    >
                      <filter-entity-select
                        v-model="filters.collector"
                        :items="filters_data.collectors"
                        placeholder="Coletor"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div
                      v-if="filters_data.buyers && filters_data.buyers.length"
                      class="col-sm-4"
                    >
                      <filter-entity-select
                        v-model="filters.buyer"
                        :items="filters_data.buyers"
                        placeholder="Cliente"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-3">
                      <filter-entity-select
                        v-model="filters.type"
                        :items="[
                          { title: 'Entrada', id: 'stock_in' },
                          { title: 'Saída', id: 'stock_out' },
                        ]"
                        placeholder="Tipo de movimentação"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div v-if="filters.type !== 'stock_in'" class="col-sm-3">
                      <filter-entity-select
                        v-model="filters.out_mode"
                        :items="modosDeSaida.map((m) => ({ title: m, id: m }))"
                        placeholder="Modo de saída"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div class="col-sm-6 from_to">
                      De
                      <b-form-input
                        v-model="filters.from"
                        type="date"
                        @selected="applyFilters"
                      />
                      Até
                      <b-form-input
                        v-model="filters.to"
                        type="date"
                        @selected="applyFilters"
                      />
                    </div>
                  </div>
                </b-form-group>
              </div>
              <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
              <loading :loading="!filters_data" msg="Carregando filtros" />
              <loading
                :loading="!movements && !error && filtered"
                msg="Carregando movimentações"
              />
              <div v-if="!filtered && filters_data">
                <p class="alert alert-warning text-center">
                  Selecione um filtro para continuar
                </p>
              </div>
              <div v-if="movements && !movements.length">
                <p class="alert alert-warning text-center">
                  Nenhuma movimentação encontrada
                </p>
              </div>
              <div v-if="movements && movements.length">
                <table class="table b-table b-table-stacked-md">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Casa de sementes</th>
                      <th>
                        <span v-if="filters.type === 'stock_out'"
                          >Comprador</span
                        >
                        <span v-else-if="filters.type === 'stock_in'"
                          >Grupo/Coletor</span
                        >
                        <span v-else>Grupo/Comprador/Coletor</span>
                      </th>
                      <th>Sementes</th>
                      <th>Quantidade</th>
                      <th v-if="filters.type !== 'stock_out'">Remuneração</th>
                      <th v-if="filters.type !== 'stock_in'">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(movement, i) in movements" :key="i">
                      <td>
                        <div>
                          <a
                            :class="{
                              'mb-1 badge badge-success':
                                movement.type === 'stock_in',
                              'mb-1 badge badge-danger':
                                movement.type === 'stock_out',
                            }"
                            :title="movement.comment"
                            @click="setFilter('type', movement.type)"
                          >
                            {{
                              movement.type === 'stock_in' ? 'Entrada' : 'Saída'
                            }}
                          </a>
                          <small>{{
                            movement.createdAt | moment('DD/MM/YYYY')
                          }}</small>
                          <a
                            v-if="movement.lot"
                            @click="setFilter('lot', movement.lot._id)"
                          >
                            <small>{{ movement.lot.code }}</small>
                          </a>
                        </div>
                      </td>
                      <td>
                        <a
                          v-if="movement.seeds_house"
                          @click="
                            setFilter('seeds_house', movement.seeds_house._id)
                          "
                        >
                          {{ movement.seeds_house.name }}
                        </a>
                        <span v-if="movement.seeds_house_code">
                          {{ movement.seeds_house_code }}
                        </span>
                      </td>
                      <td>
                        <div
                          v-for="(type, index) in [
                            'group',
                            'collector',
                            'buyer',
                          ]"
                          :key="index"
                        >
                          <a
                            v-if="movement[type]"
                            @click="setFilter(type, movement[type]._id)"
                          >
                            {{ movement[type].name }}
                          </a>
                        </div>
                      </td>
                      <td>
                        <span>
                          <a
                            v-if="movement.seed"
                            class="inline"
                            @click="setFilter('seed', movement.seed._id)"
                          >
                            {{ movement.seed.name }}
                          </a>
                          <span v-if="movement.seed_name">
                            {{ movement.seed_name }}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span>{{ movement.qtd | kg }}</span>
                      </td>
                      <td v-if="filters.type !== 'stock_out'">
                        <span v-if="movement.type === 'stock_in'">{{
                          (movement.qtd * movement.compensation_collect) | moeda
                        }}</span>
                      </td>
                      <td v-if="filters.type !== 'stock_in'">
                        <span v-if="movement.type === 'stock_out'">
                          {{ (movement.qtd * movement.price) | moeda }}
                        </span>
                        <a
                          v-if="movement.out_mode"
                          @click="setFilter('out_mode', movement.out_mode)"
                        >
                          <small
                            >({{
                              movement.out_mode.replace('Venda ', '')
                            }})</small
                          >
                        </a>
                      </td>
                      <td class="actions">
                        <a class="fa fa-trash" @click="remove(movement)"></a>
                      </td>
                    </tr>
                  </tbody>
                  <!-- eslint-disable-next-line -->
                  <tfoot>
                    <tr class="b-table-bottom-row">
                      <td />
                      <td />
                      <td />
                      <td><strong> Total</strong></td>
                      <td>
                        <strong>{{ total_qtd | kg }}</strong>
                      </td>
                      <td v-if="filters.type !== 'stock_out'">
                        <strong>{{
                          total_compensation_collect | moeda
                        }}</strong>
                      </td>
                      <td v-if="filters.type !== 'stock_in'">
                        <strong>{{ total_price | moeda }}</strong>
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </b-tab>
            <b-tab
              v-if="filters_data"
              title="Controle de sementes"
              @click="calcStock()"
            >
              <loading
                :loading="(!filters_data.seeds || !stock_summary) && !error"
                msg="Carregando lista de sementes"
              />
              <div v-if="filters_data.seeds && stock_summary">
                <div v-if="filters_data" class="filters gray">
                  <b-form-group label="Filtrar por:">
                    <div class="row">
                      <div class="col-sm-4">
                        <div
                          v-if="
                            filters_data.seeds_houses &&
                            filters_data.seeds_houses.length
                          "
                        >
                          <filter-entity-select
                            v-model="stock_filters.seeds_house"
                            :items="filters_data.seeds_houses"
                            placeholder="Casa de sementes"
                            item-text="title"
                            item-value="id"
                            @selected="calcStock"
                          />
                        </div>
                      </div>
                      <div class="col-sm-offset-5 col-sm-3">
                        <select v-model="out_mode" class="pull-right">
                          <option
                            v-for="(val, key) in out_modes"
                            :key="key"
                            :value="key"
                          >
                            {{ val }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </b-form-group>
                </div>
                <table class="table b-table b-table-stacked-md">
                  <thead>
                    <tr>
                      <th>Semente</th>
                      <th>Nome científico</th>
                      <th>Estoque</th>
                      <th>{{ out_modes[out_mode] }}</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(seed, index) in filters_data.seeds">
                      <tr
                        v-if="stock_summary && stock_summary.summary[seed.id]"
                        :key="index"
                      >
                        <td>
                          <n-link :to="'/sementes/' + seed.id">{{
                            seed.title
                          }}</n-link>
                        </td>
                        <td>
                          {{ seed.description }}
                        </td>
                        <td>
                          <span
                            :class="{
                              'text-danger':
                                stock_summary.summary[seed.id].qtd <= 0,
                            }"
                          >
                            {{ stock_summary.summary[seed.id].qtd | kg }}
                          </span>
                        </td>
                        <td>
                          <span v-if="stock_summary.summary[seed.id].qtd > 0">
                            {{
                              stock_summary.summary[seed.id][out_mode] | moeda
                            }}
                          </span>
                        </td>
                        <td>
                          <span v-if="stock_summary.summary[seed.id].qtd > 0">
                            {{
                              (stock_summary.summary[seed.id].qtd *
                                stock_summary.summary[seed.id][out_mode])
                                | moeda
                            }}
                          </span>
                        </td>
                      </tr>
                    </template>
                    <tr>
                      <td />
                      <td><strong> Total</strong></td>
                      <td>
                        <strong>{{ stock_summary.total | kg }}</strong>
                      </td>
                      <td />
                      <td>
                        <strong>{{
                          Object.values(stock_summary.summary).reduce(
                            (a, b) => a + b[out_mode] * b.qtd,
                            0
                          ) | moeda
                        }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ExcellentExport from 'excellentexport'
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'
import modosDeSaida from '@/data/modos-de-saida.json'
export default {
  name: 'Stock',
  components: {
    Loading,
    Breadcrumb,
    FilterEntitySelect,
  },

  data() {
    return {
      tabIndex: null,
      movements: null,
      stock_summary: null,
      totals: null,
      filtered: false,
      filters_data: null,
      filters: {
        search: null,
        type: null,
        seeds_house: null,
        buyer: null,
        group: null,
        collector: null,
        seed: null,
        lot: null,
        out_mode: null,
        from: null,
        to: null,
        year: new Date().getFullYear().toString(),
      },
      stock_filters: {
        seeds_house: null,
      },
      total_qtd: 0,
      total_compensation_collect: 0,
      total_price: 0,
      total_seeds_qtd: 0,
      modosDeSaida,
      out_modes: {
        price: 'Preço Varejo',
        wholesale_price: 'Preço Atacado',
        compensation_collect: 'Remuneração',
      },
      out_mode: 'price',
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
    async list() {
      this.filters_data = await this.loadList('stock_filters')
      this.applyFilters()
    },
    onFiltered() {
      if (this.movements) {
        this.total_qtd = 0
        this.total_compensation_collect = 0
        this.total_price = 0
        this.movements.forEach((item) => {
          if (item.type === 'stock_in') {
            this.total_compensation_collect +=
              item.qtd * item.compensation_collect
            this.total_qtd += item.qtd
          } else {
            this.total_qtd -= item.qtd
            this.total_price += item.qtd * item.price
          }
        })
      }
    },
    setFilter(field, value) {
      this.filters[field] = value
      this.applyFilters()
    },
    async applyFilters() {
      this.movements = null
      this.movements = await this.loadList('stock', this.filters)
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
    async calcStock() {
      this.stock_summary = null
      this.stock_filters.year = this.filters.year
      this.stock_summary = await this.loadList(
        'stock_summary',
        this.stock_filters
      )
    },
    remove(movement) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete(movement.type + '/' + movement._id)
          .then(() => {
            this.applyFilters()
            this.notify('A movimentação foi removida')
          })
          .catch(this.showError)
      }
    },
    downloadXLS(event) {
      let sheetname = 'Movimentações'
      let title = sheetname
      if (this.filters.type) {
        if (this.filters.type === 'stock_in') {
          title = 'Entradas'
        } else if (this.filters.type === 'stock_out') {
          title = 'Saídas'
        }
      }
      let data = []
      if (this.tabIndex === 0) {
        data = this.downloadMovements()
        if (this.filters.seeds_house) {
          title +=
            ' - ' +
            this.filters_data.seeds_houses.find(
              (seedsHouse) => seedsHouse.id === this.filters.seedsHouse
            ).description
        }
      } else {
        sheetname = 'Controle de sementes no estoque'
        title = sheetname
        if (this.stock_filters.seeds_house) {
          title +=
            ' - ' +
            this.filters_data.seeds_houses.find(
              (seedsHouse) => seedsHouse.id === this.stock_filters.seedsHouse
            ).description
        }
        data = this.downloadSummary()
      }
      // title = title.slice(0, 31)
      return ExcellentExport.convert(
        {
          anchor: event.target,
          filename:
            title + ' - ' + this.$moment(new Date()).format('DD-MM-YYYY'),
          format: 'xls',
        },
        [
          {
            name: sheetname,
            from: {
              array: data,
              arrayHasHeader: true,
            },
          },
        ]
      )
    },
    downloadSummary() {
      const sheet = []
      const header = ['Semente', 'Nome científico', 'Quantidade']
      header.push(this.out_modes[this.out_mode])
      header.push('Total')
      sheet.push(header)
      this.filters_data.seeds.forEach((seed) => {
        const row = []
        if (
          this.stock_summary &&
          this.stock_summary.summary &&
          this.stock_summary.summary[seed.id]
        ) {
          row.push(seed.title)
          row.push(seed.description)
          row.push(
            parseFloat(this.stock_summary.summary[seed.id].qtd).toFixed(3)
          )

          row.push(
            parseFloat(
              this.stock_summary.summary[seed.id][this.out_mode]
            ).toFixed(3)
          )
          row.push(
            parseFloat(
              this.stock_summary.summary[seed.id][this.out_mode] *
                this.stock_summary.summary[seed.id].qtd
            ).toFixed(3)
          )

          sheet.push(row)
        }
      })
      return sheet
    },
    downloadMovements() {
      const sheet = []
      sheet.push([
        'Data',
        'Tipo',
        'Casa de Sementes',
        'Grupo',
        'Coletor',
        'Comprador',
        'Semente',
        'Nome científico',
        'Quantidade',
        'Remuneração',
        'Preço',
        'Modo de saída',
      ])
      this.movements.forEach((movement) => {
        const row = []
        row.push(this.$moment(movement.createdAt).format('DD/MM/YYYY'))
        row.push(movement.type === 'stock_in' ? 'Entrada' : 'Saída')
        row.push(movement.seeds_house.name)

        if (movement.group) {
          row.push(movement.group.name)
        } else if (movement.group_name) {
          row.push(movement.group_name)
        } else {
          row.push('')
        }
        if (movement.collector) {
          row.push(movement.collector.name)
        } else {
          row.push('')
        }
        if (movement.buyer) {
          row.push(movement.buyer.name)
        } else {
          row.push('')
        }
        if (movement.seed) {
          row.push(movement.seed.name)
          row.push(movement.seed.scientific_name)
        } else if (movement.seed_name) {
          row.push(movement.seed_name)
          row.push('')
        } else {
          row.push('')
          row.push('')
        }
        row.push(movement.qtd)

        if (movement.type === 'stock_in') {
          row.push(movement.qtd * movement.compensation_collect)
          row.push('')
        } else {
          row.push('')
          row.push(movement.qtd * movement.price)
          row.push(movement.out_mode)
        }

        sheet.push(row)
      })

      return sheet
    },
    print() {
      window.print()
    },
    yearChanged() {
      if (this.tabIndex === 0) {
        this.applyFilters()
      } else {
        this.calcStock()
      }
    },
  },
}
</script>
