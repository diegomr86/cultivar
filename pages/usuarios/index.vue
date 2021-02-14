<template>
  <div class="users">
    <breadcrumb :active="currentRoleText" />
    <b-container fluid>
      <div class="panel-body">
        <list-headline
          :name="currentRoleText"
          :add-url="'/usuarios/cadastrar?role=' + ($route.query.role || '')"
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
          <loading :loading="!users && !error" msg="Carregando lista" />
          <no-item :list="users" />
          <div v-if="users && users.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="users"
              :sort-by="'name'"
              :filter="filters.search"
            >
              <template #cell(name)="data">
                <n-link :to="'/usuarios/' + data.item._id">
                  <strong>{{
                    data.item.nickname && data.item.nickname !== data.item.name
                      ? data.item.nickname
                      : data.item.name
                  }}</strong>
                  <small v-if="data.item.nickname !== data.item.name"
                    ><br />{{ data.item.name }}</small
                  >
                </n-link>
              </template>
              <template #cell(role)="data">
                {{ roleText(data.value) }}
              </template>
              <template #cell(network)="data">
                <small>{{ data.value.name }}<br /></small>
              </template>
              <template #cell(actions)="data">
                <n-link
                  :to="
                    '/usuarios/' +
                    data.item._id +
                    '/editar?role=' +
                    ($route.query.role || '')
                  "
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
    </b-container>
  </div>
</template>
<script>
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import ListHeadline from '@/components/ListHeadline'
import Breadcrumb from '@/components/Breadcrumb'
import tiposDeUsuario from '@/data/tipos-de-usuario.json'

export default {
  components: {
    Loading,
    NoItem,
    ListHeadline,
    Breadcrumb,
  },
  data() {
    return {
      tiposDeUsuario,
      filters: { search: null },
      table_fields: [
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'address.city', label: 'Localidade', sortable: true },
        { key: 'role', label: 'Perfil', sortable: true },
      ],
      users: null,
    }
  },
  computed: {
    currentRoleText() {
      if (this.$route.query.role === 'collector') {
        return 'Coletores'
      } else if (this.$route.query.role === 'client') {
        return 'Clientes'
      } else {
        return 'Usuários'
      }
    },
  },
  watchQuery(newQuery) {
    this.list(newQuery)
  },
  created() {
    this.list(this.$route.query)
    if (this.isSuper) {
      this.table_fields.push({ key: 'network', label: 'Rede', sortable: true })
      this.table_fields.push({
        key: 'actions',
        label: 'Ações',
        class: 'actions',
      })
    } else {
      this.table_fields.push({
        key: 'actions',
        label: 'Ações',
        class: 'actions',
      })
    }
  },
  methods: {
    list(query) {
      this.$axios
        .$get('users', {
          params: {
            role: query.role,
            populate: 'network',
          },
        })
        .then((users) => {
          this.users = users
        })
        .catch(this.showError)
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .$delete('users/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
  },
}
</script>
