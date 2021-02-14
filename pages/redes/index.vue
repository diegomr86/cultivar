<template>
  <div class="networks">
    <breadcrumb active="Redes" />
    <div class="panel">
      <div class="panel-body">
        <list-headline
          name="Redes"
          add-url="/redes/cadastrar"
          :filters="filters"
        />
        <div class="info-content">
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!networks && !error"
            msg="Carregando lista de redes"
          />
          <no-item :list="networks" />
          <div v-if="networks && networks.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="networks"
              :sort-by="'name'"
              :filter="filters.search"
            >
              <template #cell(name)="data">
                <n-link :to="'/redes/' + data.item._id">
                  {{ data.item.name }}
                </n-link>
              </template>
              <template #cell(actions)="data">
                <n-link
                  :to="'/redes/' + data.item._id + '/editar'"
                  class="fa fa-edit btn btn-secondary btn-sm"
                ></n-link>
                <a
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
  name: 'Networks',

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
          key: 'name',
          label: 'Rede',
          sortable: true,
        },
        {
          key: 'domain_name',
          label: 'Domínio',
          sortable: true,
        },
        {
          key: 'contact',
          label: 'Contatos',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Ações',
          class: 'actions',
        },
      ],
      networks: null,
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      this.networks = await this.loadList('networks')
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('networks/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
  },
}
</script>
