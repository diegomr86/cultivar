<template>
  <div class="seeds-houses">
    <breadcrumb active="Casas de semente" />
    <div class="panel">
      <div class="panel-body">
        <list-headline
          name="Casas de semente"
          add-url="/casa-de-sementes/cadastrar"
          :filters="filters"
        />
        <div class="info-content">
          <div class="text-right">
            <input
              v-model="filters.search"
              type="search"
              placeholder="Buscar"
              class="form-control search-input"
            />
          </div>
          <br />
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!seeds_houses && !error"
            msg="Carregando lista de casas"
          />
          <no-item :list="seeds_houses" />
          <div v-if="seeds_houses && seeds_houses.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="seeds_houses"
              :sort-by="'name'"
              :filter="filters.search"
            >
              <template #cell(name)="data">
                <n-link :to="'/casas-de-sementes/' + data.item._id">{{
                  data.item.name
                }}</n-link>
              </template>
              <template #cell(address)="data">
                <span>{{
                  [data.value.city, data.value.uf].filter((v) => v).join(' - ')
                }}</span>
              </template>
              <template #cell(actions)="data">
                <n-link
                  v-if="!isSuper"
                  :to="'/casas-de-sementes/' + data.item._id + '/editar'"
                  class="fa fa-edit btn btn-secondary btn-sm"
                ></n-link>
                <a
                  v-if="!isSuper"
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
  name: 'SeedsHouses',

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
      table_fields: [
        {
          key: 'code',
          label: 'Código',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome da casa',
          sortable: true,
        },
        {
          key: 'address',
          label: 'Localidade',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Ações',
          class: 'actions',
        },
      ],
      seeds_houses: null,
    }
  },

  created() {
    this.list()
  },

  methods: {
    list() {
      this.$axios
        .get('seeds_houses')
        .then((response) => {
          this.seeds_houses = response.data
        })
        .catch(this.showError)
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('seeds_houses/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
  },
}
</script>
