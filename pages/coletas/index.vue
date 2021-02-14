<template>
  <div class="collections">
    <breadcrumb active="Coletas de sementes" />
    <div class="panel">
      <div class="panel-body">
        <list-headline
          name="Coletas de sementes"
          add-url="/coletas/cadastrar"
          :filters="filters"
        />
        <div class="info-content">
          <b-form-select
            v-if="!filters.from && !filters.to"
            v-model="filters.year"
            :options="years"
            class="years-filter"
            @input="yearChanged"
          ></b-form-select>
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!collections && !error"
            msg="Carregando lista de coletas"
          />
          <no-item :list="collections" />
          <div v-if="collections && collections.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="collections"
              :sort-by="'title'"
              :filter="filters.search"
            >
              <template #cell(date_time)="data">
                <n-link
                  v-if="data.item.date_time"
                  :to="'/coletas/' + data.item._id"
                >
                  {{ data.item.date_time | moment('DD/MM/YYYY HH:mm') }}
                </n-link>
              </template>
              <template #cell(group_collector)="data">
                <n-link
                  v-if="data.item.group"
                  :to="'/grupos/' + data.item.group._id"
                >
                  {{ data.item.group.name }}
                </n-link>
                <n-link
                  v-if="data.item.collector"
                  :to="'/usuarios/' + data.item.collector._id"
                >
                  {{ data.item.collector.name }}
                </n-link>
              </template>
              <template #cell(seed)="data">
                <n-link
                  v-if="data.item.seed"
                  :to="'/sementes/' + data.item.seed._id"
                >
                  {{ data.item.seed.name }}
                </n-link>
              </template>
              <template #cell(weight_gross)="data">
                <span v-if="data.item.weight_gross">
                  {{ data.item.weight_gross | kg }}
                </span>
              </template>
              <template #cell(actions)="data">
                <n-link
                  v-if="!isSuper"
                  :to="'/coletas/' + data.item._id + '/editar'"
                  class="fa fa-edit btn btn-secondary btn-sm"
                ></n-link>
                <a
                  v-if="!isSuper && isManagerOrAbove"
                  class="fa fa-trash btn btn-danger btn-sm"
                  @click="remove(data.item._id)"
                ></a>
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
  name: 'Collections',
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
        year: new Date().getFullYear().toString(),
      },
      collections: [],
      table_fields: [
        {
          key: 'date_time',
          label: 'Data/Hora',
          sortable: true,
        },
        {
          key: 'seed',
          label: 'Semente',
          sortable: true,
        },
        {
          key: 'group_collector',
          label: 'Grupo/Coletor',
          sortable: true,
        },
        {
          key: 'weight_gross',
          label: 'Peso bruto',
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
      return this.potentials
        .map((potential) => {
          return potential.weight
        })
        .reduce((a, b) => a + b, 0)
    },
    total_compensation_collect() {
      return this.potentials
        .map((potential) => {
          return potential.compensation_collect
        })
        .reduce((a, b) => a + b, 0)
    },
  },
  created() {
    this.list()
  },
  methods: {
    async list() {
      this.collections = await this.loadList('collections', {
        populate: 'group collector seed',
        filters: this.filters,
      })
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('collections/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
    yearChanged() {
      this.list()
    },
  },
}
</script>
