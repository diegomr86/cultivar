<template>
  <div class="collector-stock-ins">
    <breadcrumb :active="'Entregas de ' + currentUser.name" />
    <div class="panel">
      <div class="panel-body">
        <list-headline name="Entregas" :filters="filters" />
        <div class="info-content">
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!stock_ins && !error"
            msg="Carregando lista de pedidos"
          />
          <no-item :list="stock_ins" />
          <div v-if="stock_ins && stock_ins.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="stock_ins"
              :sort-by="'created'"
              :sort-desc="true"
              :filter="filters.search"
            >
              <template #cell(createdAt)="data">
                {{ data.item.createdAt | moment('DD/MM/YYYY') }}
              </template>
              <template #cell(seed)="data">
                <p>
                  {{ data.item.seed.name }}
                </p>
              </template>
              <template #cell(qtd)="data">
                {{ data.item.qtd | kg }}
              </template>
              <template #cell(compensation_collect)="data">
                {{ (data.item.qtd * data.item.compensation_collect) | moeda }}
              </template>
              <!-- eslint-disable-next-line -->
            <template #cell(bottom-row)="data">
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <strong>{{ total_qtd | kg }}</strong>
                </td>
                <td>
                  <strong>{{ total_compensation_collect | moeda }}</strong>
                </td>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'CollectorStockIns',
  components: {
    Loading,
    NoItem,
    ListHeadline,
    Breadcrumb,
  },
  data() {
    return {
      filters: {
        search: null,
      },
      stock_ins: null,
      table_fields: [
        {
          key: 'createdAt',
          label: 'Data da Entrega',
          sortable: true,
        },
        {
          key: 'seeds_house.name',
          label: 'Casa de sementes',
          sortable: true,
        },
        {
          key: 'seed',
          label: 'Semente',
          sortable: true,
        },
        {
          key: 'qtd',
          label: 'Quantidade',
          sortable: true,
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    total_qtd() {
      return this.stock_ins
        .map((stockIn) => {
          return stockIn.qtd
        })
        .reduce((a, b) => a + b, 0)
    },
    total_compensation_collect() {
      return this.stock_ins
        .map((stockIn) => {
          return stockIn.qtd * stockIn.compensation_collect
        })
        .reduce((a, b) => a + b, 0)
    },
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      this.$axios
        .get('collector/stock_ins', {
          params: {
            populate: 'seeds_house seed',
          },
        })
        .then((response) => {
          this.stock_ins = response.data
        })
        .catch(this.showError)
    },
  },
}
</script>
