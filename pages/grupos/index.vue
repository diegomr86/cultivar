<template>
  <div class="group">
    <breadcrumb active="Grupos de coletores" />
    <div class="panel">
      <div class="panel-body">
        <list-headline
          name="Grupos de coletores"
          add-url="/grupos/cadastrar"
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
            :loading="!groups && !error"
            msg="Carregando lista de grupos"
          />
          <no-item :list="groups" />
          <div v-if="groups && groups.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="groups"
              :sort-by="'name'"
              :filter="filters.search"
            >
              <template #cell(name)="data">
                <n-link :to="'/grupos/' + data.item._id">
                  {{ data.item.name }}
                </n-link>
              </template>
              <template #cell(collectors)="data">
                <small v-if="data.value">
                  {{ data.value.length }}
                  {{ data.value.length | pluralize('coletor', 'coletores') }}
                </small>
              </template>
              <template #cell(address)="data">
                <span>{{ data.value | city }}</span>
              </template>
              <template #cell(actions)="data">
                <n-link
                  v-if="!isSuper"
                  :to="'/grupos/' + data.item._id + '/editar'"
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
  name: 'Groups',

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
          label: 'Grupo',
          sortable: true,
        },
        {
          key: 'collectors',
          label: 'Coletores',
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
      groups: null,
    }
  },

  created() {
    this.list()
  },

  methods: {
    async list() {
      this.groups = await this.loadList('groups')
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('groups/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
  },
}
</script>
