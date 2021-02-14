<template>
  <div class="seeds-matrixes">
    <breadcrumb active="Matrizes de sementes" />
    <div class="panel">
      <div class="panel-body">
        <list-headline
          name="Matrizes de sementes"
          add-url="/matrizes-de-sementes/cadastrar"
          :filters="filters"
        />
        <div class="info-content">
          <b-tabs content-class="mt-3">
            <b-tab title="Lista" active>
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
                :loading="!seeds_matrixes && !error"
                msg="Carregando lista de matrizes"
              />
              <no-item :list="seeds_matrixes" />
              <div v-if="seeds_matrixes && seeds_matrixes.length">
                <b-table
                  stacked="md"
                  :fields="table_fields"
                  :items="seeds_matrixes"
                  :sort-by="'name'"
                  :filter="filters.search"
                >
                  <template #cell(code)="data">
                    <n-link :to="'/matrizes-de-sementes/' + data.item._id">{{
                      data.item.code
                    }}</n-link>
                  </template>
                  <template #cell(name)="data">
                    <n-link :to="'/matrizes-de-sementes/' + data.item._id">{{
                      data.item.name
                    }}</n-link>
                    <p v-if="data.item.seed_matrix_scient_name">
                      <small>{{ data.item.seed_matrix_scient_name }}</small>
                    </p>
                  </template>
                  <template #cell(groups)="data">
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
                  <template #cell(category)="data">
                    <p v-if="data.item.category">
                      <small
                        >{{
                          origensDeMatrizes.find(
                            (v) => data.item.source === v.value
                          ).text
                        }}
                        -
                        {{
                          categoriasDeMatrizes.find(
                            (v) => data.item.category === v.value
                          ).text
                        }}</small
                      >
                    </p>
                  </template>
                  <template #cell(actions)="data">
                    <n-link
                      v-if="!isSuper"
                      :to="'/matrizes-de-sementes/' + data.item._id + '/editar'"
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
            </b-tab>
            <b-tab title="Mapa" lazy>
              <Map :markers="seeds_matrixes" link="/matriz-de-sementes" />
            </b-tab>
          </b-tabs>
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
import Map from '@/components/Map'
import categoriasDeMatrizes from '@/data/categorias-de-matrizes.json'
import origensDeMatrizes from '@/data/origens-de-matrizes.json'

export default {
  name: 'CollectionAreas',
  components: {
    Loading,
    NoItem,
    ListHeadline,
    Breadcrumb,
    Map,
  },
  data() {
    return {
      filters: {
        search: null,
      },
      categoriasDeMatrizes,
      origensDeMatrizes,
      seeds_matrixes: null,
      table_fields: [
        {
          key: 'code',
          label: 'Código',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome da matriz',
          sortable: true,
        },
        {
          key: 'groups',
          label: 'Grupo / Coletor',
          sortable: true,
        },
        {
          key: 'category',
          label: 'Origem / Categoria',
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
  created() {
    this.list()
  },
  methods: {
    list() {
      this.$axios
        .get('seeds_matrixes', {
          params: {
            populate: 'group collector',
          },
        })
        .then((response) => {
          this.seeds_matrixes = response.data
        })
        .catch(this.showError)
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('seeds_matrixes/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
  },
}
</script>
