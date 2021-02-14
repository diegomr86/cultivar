<template>
  <div class="request">
    <breadcrumb active="Pedidos para coletores" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Pedidos para coletores</h1>
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
              v-if="requests && requests.length"
              class="btn btn-primary btn-sm"
              @click="downloadXLS"
            >
              <i class="fa fa-download" /> Exportar
            </a>
            <a
              v-if="requests && requests.length"
              class="btn btn-primary btn-sm"
              @click="print()"
            >
              <i class="fa fa-print" /> Imprimir
            </a>
            <n-link to="/pedidos/cadastrar" class="btn btn-primary btn-sm">
              <i class="fa fa-plus" /> Cadastrar
            </n-link>
          </div>
        </div>
        <div class="info-content">
          <b-form-select
            v-if="!filters.from && !filters.to"
            v-model="filters.year"
            :options="years"
            class="years-filter"
            @input="yearChanged"
          ></b-form-select>
          <b-tabs v-model="tabIndex" content-class="mt-3" changed>
            <b-tab title="Por semente" active>
              <loading
                :loading="!seeds_summary"
                msg="Carregando lista de sementes"
              />
              <div v-if="seeds_summary">
                <div class="filters gray">
                  <b-form-group label="Filtrar por:">
                    <div class="row">
                      <div class="col-sm-4">
                        <filter-entity-select
                          v-model="filters.group"
                          type="groups"
                          placeholder="Grupo de coletores"
                          item-text="title"
                          item-value="id"
                          @selected="groupChanged"
                        />
                      </div>
                    </div>
                  </b-form-group>
                </div>
                <no-item :list="seeds_summary" />
                <table
                  v-if="seeds_summary && seeds_summary.length"
                  class="table b-table b-table-stacked-md"
                >
                  <thead>
                    <tr>
                      <th>Semente</th>
                      <th>Nome científico</th>
                      <th>Quantidade</th>
                      <th>Remuneração total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in seeds_summary">
                      <tr :key="index">
                        <td>
                          <n-link :to="'/sementes/' + item.seed.id">{{
                            item.seed.name
                          }}</n-link>
                        </td>
                        <td>
                          <n-link :to="'/sementes/' + item.seed.id">{{
                            item.seed.scientific_name
                          }}</n-link>
                        </td>
                        <td>
                          {{ item.qtd | kg }}
                        </td>
                        <td>
                          {{ item.total | moeda }}
                        </td>
                      </tr>
                    </template>
                    <tr>
                      <td />
                      <td><strong> Total</strong></td>
                      <td>
                        <strong>{{
                          seeds_summary
                            .map((item) => item.qtd || 0)
                            .reduce((a, b) => a + b, 0) | kg
                        }}</strong>
                      </td>
                      <td>
                        <strong>{{
                          seeds_summary
                            .map((item) => item.total || 0)
                            .reduce((a, b) => a + b, 0) | moeda
                        }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-tab>
            <b-tab title="Por grupo">
              <loading
                :loading="!groups_summary"
                msg="Carregando lista de grupos"
              />
              <div v-if="groups_summary">
                <div class="filters gray">
                  <b-form-group label="Filtrar por:">
                    <div class="row">
                      <div class="col-sm-4">
                        <filter-entity-select
                          v-model="filters.seed"
                          type="seeds"
                          placeholder="Semente"
                          item-text="title"
                          item-value="id"
                          @selected="seedChanged"
                        />
                      </div>
                    </div>
                  </b-form-group>
                </div>
                <no-item :list="groups_summary" />
                <table
                  v-if="groups_summary && groups_summary.length"
                  class="table b-table b-table-stacked-md"
                >
                  <thead>
                    <tr>
                      <th>Grupo</th>
                      <th>Quantidade</th>
                      <th>Remuneração total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in groups_summary">
                      <tr :key="index">
                        <td>
                          <n-link :to="'/grupos/' + item.group._id">{{
                            item.group.name
                          }}</n-link>
                        </td>
                        <td>
                          {{ item.qtd | kg }}
                        </td>
                        <td>
                          {{ item.total | moeda }}
                        </td>
                      </tr>
                    </template>
                    <tr>
                      <td><strong> Total</strong></td>
                      <td>
                        <strong>{{
                          groups_summary
                            .map((item) => item.qtd || 0)
                            .reduce((a, b) => a + b, 0) | kg
                        }}</strong>
                      </td>
                      <td>
                        <strong>{{
                          groups_summary
                            .map((item) => item.total || 0)
                            .reduce((a, b) => a + b, 0) | moeda
                        }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-tab>
            <b-tab title="Registros">
              <div class="filters gray">
                <b-form-group label="Filtrar por:">
                  <div class="row">
                    <div class="col-sm-4">
                      <filter-entity-select
                        v-model="filters.seed"
                        type="seeds"
                        placeholder="Semente"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div class="col-sm-4">
                      <filter-entity-select
                        v-model="filters.group"
                        type="groups"
                        placeholder="Grupo de coletores"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                    <div class="col-sm-4">
                      <filter-entity-select
                        v-model="filters.collector"
                        type="collectors"
                        placeholder="Coletor"
                        item-text="title"
                        item-value="id"
                        @selected="applyFilters"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6 from_to">
                      De
                      <b-form-input
                        v-model="filters.from"
                        type="date"
                        @input="applyFilters"
                      />
                      Até
                      <b-form-input
                        v-model="filters.to"
                        type="date"
                        @input="applyFilters"
                      />
                    </div>
                  </div>
                </b-form-group>
              </div>
              <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
              <loading
                :loading="!requests && !error"
                msg="Carregando pedidos para coletores"
              />
              <no-item :list="requests" />
              <div v-if="requests && requests.length">
                <b-table
                  stacked="md"
                  :fields="table_fields"
                  :items="requests"
                  :sort-by="'name'"
                  :filter="filters.search"
                >
                  <template #cell(createdAt)="data">
                    {{ data.value | moment('DD/MM/YYYY') }}
                  </template>
                  <template #cell(seed)="data">
                    <a
                      v-if="data.item.seed"
                      @click="setFilter(data.field.key, data.item.seed._id)"
                    >
                      {{ data.item.seed.name }}
                    </a>
                  </template>
                  <template #cell(group)="data">
                    <a
                      v-if="data.item.group"
                      @click="setFilter(data.field.key, data.item.group._id)"
                    >
                      {{ data.item.group.name }}
                      <br />
                    </a>
                    <a
                      v-if="data.item.collector"
                      @click="
                        setFilter(data.field.key, data.item.collector._id)
                      "
                    >
                      {{ data.item.collector.name }}
                    </a>
                  </template>
                  <template #cell(qtd)="data">
                    <div>
                      {{ data.value | kg }}
                    </div>
                  </template>
                  <template #cell(compensation_collect)="data">
                    {{
                      (data.item.qtd * data.item.compensation_collect) | moeda
                    }}
                  </template>
                  <template #cell(actions)="data">
                    <a
                      class="fa fa-trash btn btn-danger btn-sm"
                      @click="remove(data.item._id)"
                    ></a>
                  </template>
                  <!-- eslint-disable-next-line -->
                <template #cell(bottom-row)="data">
                    <td />
                    <td />
                    <td><strong> Total</strong></td>
                    <td>
                      <strong>{{ total.qtd | kg }}</strong>
                    </td>
                    <td>
                      <strong>{{ total.compensation_collect | moeda }}</strong>
                    </td>
                    <td />
                  </template>
                </b-table>
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
import NoItem from '@/components/NoItem'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'

export default {
  name: 'Requests',
  components: {
    Loading,
    NoItem,
    Breadcrumb,
    FilterEntitySelect,
  },

  data() {
    return {
      tabIndex: null,
      filters: {
        search: null,
        seed: null,
        collector: null,
        group: null,
        from: null,
        to: null,
        year: new Date().getFullYear().toString(),
      },
      group_name: null,
      requests: null,
      seeds_summary: null,
      groups_summary: null,
      table_fields: [
        {
          key: 'createdAt',
          label: 'Data',
          sortable: true,
        },
        {
          key: 'seed',
          label: 'Semente',
          sortable: true,
        },
        {
          key: 'group',
          label: 'Grupo/Coletor',
          sortable: true,
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true,
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração total',
          sortable: true,
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração total',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Ações',
          class: 'actions',
        },
      ],
    }
  },
  computed: {
    showClearButton() {
      return Object.keys(this.filters).find((k) => this.filters[k])
    },
    total() {
      let qtd = 0
      let compensationCollect = 0
      if (this.requests) {
        this.requests.forEach((item) => {
          qtd += item.qtd
          compensationCollect += item.qtd * item.compensationCollect
        })
      }
      return { qtd, compensationCollect }
    },
  },
  watch: {
    tabIndex() {
      this.loadTab()
    },
  },

  created() {
    this.loadTab()
  },
  methods: {
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('requests/' + id)
          .then(() => {
            this.applyFilters()
          })
          .catch(this.showError)
      }
    },
    yearChanged() {
      if (this.tabIndex === 0) {
        this.calcSeedsSummary()
      } else if (this.tabIndex === 1) {
        this.calcGroupSummary()
      } else {
        this.applyFilters()
      }
    },
    async loadTab() {
      if (this.tabIndex === 0) {
        this.filters.search = null
        this.filters.collector = null
        this.filters.seed = null
        this.filters.from = null
        this.filters.to = null
        this.calcSeedsSummary()
      } else if (this.tabIndex === 1) {
        this.filters.search = null
        this.filters.group = null
        this.filters.collector = null
        this.filters.from = null
        this.filters.to = null
        this.calcGroupSummary()
      } else {
        await this.applyFilters()
      }
    },
    async applyFilters() {
      this.requests = null
      this.requests = await this.loadList('requests', {
        populate: 'group collector seed',
        filters: this.filters,
      })
    },
    setFilter(field, value) {
      this.filters[field] = value
      this.applyFilters()
    },
    clearFilters() {
      Object.keys(this.filters).forEach((filter) => {
        this.filters[filter] = null
      })
      this.applyFilters()
    },
    seedChanged(filter) {
      if (filter) {
        this.seed_name = filter.title
      }
      this.calcGroupSummary()
    },
    groupChanged(filter) {
      if (filter) {
        this.group_name = filter.title
      }
      this.calcSeedsSummary()
    },
    async calcGroupSummary() {
      await this.applyFilters()
      const groups = {}
      if (this.requests && this.requests.length) {
        this.requests.forEach((request) => {
          if (request.group) {
            const id = request.group._id
            if (!groups[id]) {
              groups[id] = {
                group: request.group,
                qtd: 0,
                compensation_collect: request.compensation_collect,
                total: 0,
              }
            }
            groups[id].qtd += request.qtd
            groups[id].total += request.compensation_collect * request.qtd
          }
        })
      }
      this.groups_summary = Object.values(groups).sort(function (a, b) {
        return a.group.name.localeCompare(b.group.name)
      })
    },
    async calcSeedsSummary() {
      await this.applyFilters()
      const seeds = {}
      if (this.requests && this.requests.length) {
        this.requests.forEach((request) => {
          const id = request.seed._id
          if (!seeds[id]) {
            seeds[id] = {
              seed: request.seed,
              qtd: 0,
              compensation_collect: request.compensation_collect,
              total: 0,
            }
          }
          seeds[id].qtd += request.qtd
          seeds[id].total += request.compensation_collect * request.qtd
        })
      }
      this.seeds_summary = Object.values(seeds).sort(function (a, b) {
        return a.seed.name.localeCompare(b.seed.name)
      })
    },
    downloadXLS(event) {
      if (this.tabIndex === 0) {
        this.downloadSeedSummary(event)
      } else if (this.tabIndex === 1) {
        this.downloadGroupSummary(event)
      } else {
        this.downloadRequests(event)
      }
    },
    downloadSeedSummary(event) {
      const sheetname = 'Pedidos por semente'
      let title = sheetname
      if (this.filters.group) {
        title += ' - ' + this.group_name
      }
      const sheet = [
        ['Semente', 'Nome científico', 'Quantidade', 'Remuneração total'],
      ]
      this.seeds_summary.forEach((item) => {
        sheet.push([
          item.seed.name,
          item.seed.scientific_name,
          item.qtd,
          item.total,
        ])
      })
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
              array: sheet,
              arrayHasHeader: true,
            },
          },
        ]
      )
    },
    downloadGroupSummary(event) {
      const sheetname = 'Pedidos por grupo'
      let title = sheetname
      if (this.filters.seed) {
        title += ' - ' + this.seed_name
      }
      const sheet = [['Grupo', 'Quantidade', 'Remuneração total']]
      this.groups_summary.forEach((item) => {
        sheet.push([item.group.name, item.qtd, item.total])
      })
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
              array: sheet,
              arrayHasHeader: true,
            },
          },
        ]
      )
    },
    downloadRequests(event) {
      const sheetname = 'Registros de pedidos'
      const title = sheetname
      const data = []
      const sheet = [
        [
          'Data',
          'Semente',
          'Grupo',
          'Coletor',
          'Quantidade',
          'Remuneração total',
        ],
      ]
      this.requests.forEach((request) => {
        const row = []
        row.push(this.$moment(request.createdAt).format('DD/MM/YYYY'))

        if (request.seed) {
          row.push(request.seed.name)
        } else {
          row.push('')
        }

        if (request.group) {
          row.push(request.group.name)
        } else {
          row.push('')
        }

        if (request.collector) {
          row.push(request.collector.name)
        } else {
          row.push('')
        }
        row.push(request.qtd)
        row.push(request.qtd * request.compensation_collect)
        sheet.push(row)
      })

      data.push({
        name: sheetname,
        from: {
          array: sheet,
          arrayHasHeader: true,
        },
      })

      return ExcellentExport.convert(
        {
          anchor: event.target,
          filename:
            title + ' - ' + this.$moment(new Date()).format('DD-MM-YYYY'),
          format: 'xls',
        },
        data
      )
    },
    print() {
      window.print()
    },
  },
}
</script>
