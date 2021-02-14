<template>
  <div class="orders">
    <breadcrumb active="Encomendas" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Encomendas</h1>
          </div>
          <div class="col-sm-6 main-actions">
            <a
              v-if="orders && orders.length"
              class="btn btn-primary btn-sm"
              @click="downloadXLS"
            >
              <i class="fa fa-download"></i> Exportar
            </a>
            <a
              v-if="orders && orders.length"
              class="btn btn-primary btn-sm"
              @click="print()"
            >
              <i class="fa fa-print" /> Imprimir
            </a>
            <n-link to="/encomendas/cadastrar" class="btn btn-primary btn-sm">
              <i class="fa fa-plus"></i> Cadastrar
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
            <b-tab title="Encomendas" active @click="list()">
              <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
              <loading
                :loading="!orders && !error"
                msg="Carregando lista de encomendas"
              />
              <no-item :list="orders" />
              <div v-if="orders && orders.length">
                <b-table
                  stacked="md"
                  :fields="table_fields"
                  :items="orders"
                  :sort-by="'date_receiving'"
                  :sort-desc="true"
                  :filter="filters.search"
                >
                  <template #cell(date_receiving)="data">
                    <n-link :to="'/encomendas/' + data.item._id">
                      Encomenda {{ data.item.code }}
                      <br />
                      <span v-if="data.item.date_receiving">{{
                        data.item.date_receiving | moment('DD/MM/YYYY')
                      }}</span>
                    </n-link>
                  </template>
                  <template #cell(client)="data">
                    <n-link
                      v-if="data.item.client"
                      :to="'/usuarios/' + data.item.client._id"
                      >{{ data.item.client.name }}</n-link
                    >
                    <small v-if="data.item.restored_area"
                      >{{ data.item.restored_area }} hectares</small
                    >
                  </template>
                  <template #cell(total)="data">
                    <span
                      v-if="data.item.seed_items && data.item.seed_items.length"
                      >{{
                        data.item.seed_items
                          .map(
                            (seed_item) =>
                              seed_item.qtd *
                              (data.item.purchase_type === 'Atacado'
                                ? seed_item.wholesale_price
                                : seed_item.price)
                          )
                          .reduce((a, b) => a + b, 0) | moeda
                      }}</span
                    >
                    <small v-if="data.item.purchase_type"
                      ><br />({{ data.item.purchase_type }})</small
                    >
                  </template>
                  <template #cell(qtd)="data">
                    <span
                      v-if="data.item.seed_items && data.item.seed_items.length"
                      >{{
                        data.item.seed_items
                          .map((seed_item) => seed_item.qtd)
                          .reduce((a, b) => a + b, 0) | kg
                      }}</span
                    >
                  </template>
                  <template #cell(actions)="data">
                    <n-link
                      :to="
                        '/estoque/' +
                        data.item._id +
                        '/etiqueta-e-termo-conformidade'
                      "
                      class="fa fa-print btn btn-default btn-sm"
                      title="Etiqueta e Termo"
                    ></n-link>
                    <n-link
                      v-if="!isSuper"
                      :to="'/encomendas/' + data.item._id + '/editar'"
                      class="fa fa-edit btn btn-secondary btn-sm"
                      title="Alteração"
                    ></n-link>
                    <a
                      v-if="!isSuper"
                      class="fa fa-trash btn btn-danger btn-sm"
                      title="Exclusão"
                      @click="remove(data.item._id)"
                    ></a>
                  </template>
                  <!-- eslint-disable-next-line -->
                <template #cell(bottom-row)="data">
                    <td />
                    <td><strong> Total</strong></td>
                    <td>
                      <strong>{{ total_weight | kg }}</strong>
                    </td>
                    <td>
                      <strong>{{ total_price | moeda }}</strong>
                    </td>
                    <td />
                  </template>
                </b-table>
              </div>
            </b-tab>
            <b-tab title="Encomendas por semente" @click="calcSummary()">
              <loading :loading="!summary" msg="Carregando lista de sementes" />
              <div v-if="summary">
                <div class="filters gray">
                  <b-form-group label="Filtrar por:">
                    <div class="row">
                      <div class="col-sm-4">
                        <filter-entity-select
                          v-model="summary_filters.client"
                          type="clients"
                          placeholder="Cliente"
                          item-text="title"
                          item-value="id"
                          @selected="applySummaryFilters"
                        />
                      </div>
                    </div>
                  </b-form-group>
                </div>
                <table class="table b-table b-table-stacked-md">
                  <thead>
                    <tr>
                      <th>Semente</th>
                      <th>Quantidade</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in summary">
                      <tr :key="index">
                        <td>
                          <n-link :to="'/sementes/' + item.seed.id">{{
                            item.seed.name
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
                          summary
                            .map((item) => item.qtd || 0)
                            .reduce((a, b) => a + b, 0) | kg
                        }}</strong>
                      </td>
                      <td>
                        <strong>{{
                          summary
                            .map((item) => item.total || 0)
                            .reduce((a, b) => a + b, 0) | moeda
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
import NoItem from '@/components/NoItem'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'

export default {
  name: 'Orders',

  components: {
    Loading,
    NoItem,
    Breadcrumb,
    FilterEntitySelect,
  },

  data() {
    return {
      tabIndex: null,
      orders: null,
      filters: {
        search: null,
        year: new Date().getFullYear().toString(),
      },
      summary_filters: {
        client: null,
      },
      client_name: null,
      summary: null,
      table_fields: [
        {
          key: 'date_receiving',
          label: 'Data / ID',
          sortable: true,
        },
        {
          key: 'client',
          label: 'Cliente',
          sortable: true,
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true,
        },
        {
          key: 'total',
          label: 'Total',
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
    total_weight() {
      const values = this.orders.map((order) => {
        if (order.seed_items && order.seed_items.length) {
          return order.seed_items
            .map((seedItem) => seedItem.qtd)
            .reduce((a, b) => a + b, 0)
        } else {
          return 0
        }
      })
      return values.length ? values.reduce((a, b) => a + b, 0) : 0
    },
    total_price() {
      const values = this.orders.map((order) => {
        if (order.seed_items && order.seed_items.length) {
          return order.seed_items
            .map(
              (seedItem) =>
                seedItem.qtd *
                (order.purchase_type === 'Atacado'
                  ? seedItem.wholesale_price
                  : seedItem.price)
            )
            .reduce((a, b) => a + b, 0)
        } else {
          return 0
        }
      })
      return values.length ? values.reduce((a, b) => a + b, 0) : 0
    },
  },
  created() {
    this.list()
  },
  methods: {
    async list() {
      this.orders = await this.loadList('orders', {
        populate: 'client seed_items.seed',
        filters: this.filters,
      })
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('orders/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
    applySummaryFilters(filter) {
      if (filter) {
        this.client_name = filter.title
      }
      this.calcSummary()
    },
    async calcSummary() {
      this.orders = await this.loadList('orders', {
        populate: 'client seed_items.seed',
        filters: this.filters,
      })
      const seeds = {}
      if (this.orders && this.orders.length) {
        this.orders.forEach((order) => {
          if (
            !this.summary_filters.client ||
            (order.client && this.summary_filters.client === order.client._id)
          ) {
            order.seed_items.forEach((seedItem) => {
              const id = seedItem.seed._id
              if (!seeds[id]) {
                seeds[id] = { seed: seedItem.seed, qtd: 0, total: 0 }
              }
              seeds[id].qtd += seedItem.qtd
              if (order.purchase_type === 'Varejo') {
                seeds[id].price += seedItem.price
                seeds[id].total += seedItem.price * seedItem.qtd
              } else {
                seeds[id].price += seedItem.wholesale_price
                seeds[id].total += seedItem.wholesale_price * seedItem.qtd
              }
              seeds[id].purchase_type = order.purchase_type
            })
          }
        })
      }
      this.summary = Object.values(seeds).sort(function (a, b) {
        return a.seed.name.localeCompare(b.seed.name)
      })
    },
    calcQtd(order) {
      const seedItems = this.seedItemsBySeed(order.seed_items)
      if (seedItems && seedItems.length) {
        return seedItems
          .map((seedItem) => this.sumQtd(seedItem.qtd))
          .reduce((a, b) => a + b, 0)
      }
      return 0
    },
    calcPrice(order) {
      const seedItems = this.seedItemsBySeed(order.seed_items)
      if (seedItems && seedItems.length) {
        if (order.purchase_type === 'Varejo') {
          return seedItems
            .map((seedItem) => seedItem.price * this.sumQtd(seedItem.qtd))
            .reduce((a, b) => a + b, 0)
        } else {
          return seedItems
            .map(
              (seedItem) => seedItem.wholesale_price * this.sumQtd(seedItem.qtd)
            )
            .reduce((a, b) => a + b, 0)
        }
      }
      return 0
    },
    seedItemsBySeed(seedItems) {
      if (this.filters.seed) {
        return seedItems.filter(
          (seedItem) => seedItem.seed._id === this.filters.seed
        )
      }
      return seedItems
    },
    yearChanged() {
      if (this.tabIndex === 0) {
        this.list()
      } else {
        this.calcSummary()
      }
    },
    downloadXLS(event) {
      if (this.tabIndex === 0) {
        this.downloadLists(event)
      } else {
        this.downloadSummary(event)
      }
    },
    downloadSummary(event) {
      const sheetname = 'Encomendas por semente'
      let title = sheetname
      if (this.summary_filters.client) {
        title += ' - ' + this.client_name
      }
      const sheet = [['Semente', 'Quantidade', 'Total']]
      this.summary.forEach((item) => {
        sheet.push([item.seed.name, item.qtd, item.total])
      })
      sheet.push([
        'Total',
        this.summary.map((item) => item.qtd).reduce((a, b) => a + b, 0),
        this.summary.map((item) => item.total).reduce((a, b) => a + b, 0),
      ])
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
    downloadLists(event) {
      const sheetname = 'Encomendas'
      const title = sheetname
      const data = []
      const sheet1 = [
        [
          'Data do recebimento',
          'Código',
          'Cliente',
          'Quantidade (Kg)',
          'Total (R$)',
          'Tipo de compra',
          'Valor pago (R$)',
          'Valor restante (R$)',
          'Área total (hectares)',
          'Prazo final',
          'Status do contrato',
          'Fitofisionomia',
          'Brejo?',
          'Alaga?',
          'Observações',
        ],
      ]
      this.orders.forEach((order) => {
        const row = []
        if (order.date_receiving) {
          row.push(this.$moment(order.date_receiving).format('DD/MM/YYYY'))
        } else {
          row.push('')
        }
        row.push('#' + order.code)
        if (order.client) {
          row.push(order.client.name)
        } else {
          row.push('')
        }

        row.push(this.calcQtd(order))
        row.push(this.calcPrice(order))
        row.push(order.purchase_type)
        row.push(order.amount_paid)
        row.push(order.amount_remain)
        row.push(order.restored_area)
        if (order.deadline) {
          row.push(this.$moment(order.deadline).format('DD/MM/YYYY'))
        } else {
          row.push('')
        }
        row.push(order.contract)
        row.push(order.vegetation)
        row.push(order.bog ? 'Sim' : 'Não')
        row.push(order.flood ? 'Sim' : 'Não')
        row.push(order.comments)

        sheet1.push(row)
      })

      data.push({
        name: sheetname,
        from: {
          array: sheet1,
          arrayHasHeader: true,
        },
      })

      this.orders.forEach((order) => {
        const rows = [
          [
            'Semente',
            'Valor ' + order.purchase_type,
            'Quantidade',
            'Total ' + order.purchase_type,
          ],
        ]
        let totalQtd = 0
        let totalPrice = 0
        order.seed_items
          .sort(function (a, b) {
            return a.seed.name.localeCompare(b.seed.name)
          })
          .forEach((seedItem) => {
            if (!this.filters.seed || seedItem.seed._id === this.filters.seed) {
              const row = []
              const price =
                order.purchase_type === 'Varejo'
                  ? seedItem.price
                  : seedItem.wholesale_price
              row.push(seedItem.seed.name)
              row.push(price)
              row.push(seedItem.qtd)
              row.push(seedItem.qtd * price)
              totalQtd += row[2]
              totalPrice += row[3]
              rows.push(row)
            }
          })
        rows.push(['', 'Total:', totalQtd, totalPrice])
        data.push({
          name: 'Encomenda #' + order.code,
          from: {
            array: rows,
            arrayHasHeader: true,
          },
        })
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
