<template>
  <div class="collector-requests">
    <breadcrumb :active="'Pedidos para ' + currentUser.name" />
    <div class="panel">
      <div class="panel-body">
        <list-headline name="Pedidos" :filters="filters" />
        <div class="info-content">
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!requests && !error"
            msg="Carregando lista de pedidos"
          />
          <no-item :list="requests" />
          <div v-if="requests && requests.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="requests"
              :sort-by="'created'"
              :sort-desc="true"
              :filter="filters.search"
            >
              <template #cell(seed)="data">
                {{ data.value.name }}
              </template>
              <template #cell(qtd)="data">
                {{ data.value | kg }}
              </template>
              <template #cell(qtd_delivered)="data">
                {{ data.value | kg }}
              </template>
              <template #cell(qtd_remaining)="data">
                {{ data.value | kg }}
              </template>
              <template #cell(compensation_collect)="data">
                {{ (data.item.compensation_collect * data.item.qtd) | moeda }}
              </template>
              <!-- eslint-disable-next-line -->
              <template #cell(bottom-row)="data">
                <td></td>
                <td>
                  <strong>{{ total_qtd | kg }}</strong>
                </td>
                <td>
                  <strong>{{ total_qtd_delivered | kg }}</strong>
                </td>
                <td>
                  <strong>{{ total_qtd_remaining | kg }}</strong>
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
  name: 'CollectorRequests',
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
      requests: null,
      table_fields: [
        {
          key: 'seed',
          label: 'Semente',
          sortable: true,
        },
        {
          key: 'qtd',
          label: 'Pedido',
          sortable: true,
        },
        {
          key: 'qtd_delivered',
          label: 'Entregue',
          sortable: true,
        },
        {
          key: 'qtd_remaining',
          label: 'Restante',
          sortable: true,
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração total do pedido',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    total_qtd() {
      return this.requests
        .map((request) => {
          return request.qtd
        })
        .reduce((a, b) => a + b, 0)
    },
    total_qtd_delivered() {
      return this.requests
        .map((request) => {
          return request.qtd_delivered
        })
        .reduce((a, b) => a + b, 0)
    },
    total_qtd_remaining() {
      return this.requests
        .map((request) => {
          return request.qtd_remaining
        })
        .reduce((a, b) => a + b, 0)
    },
    total_compensation_collect() {
      return this.requests
        .map((request) => {
          return request.compensation_collect * request.qtd
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
        .get('collector/requests', {
          params: {
            populate: 'seed',
          },
        })
        .then((response) => {
          this.requests = response.data
        })
        .catch(this.showError)
    },
  },
}
</script>
