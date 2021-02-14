<template>
  <div class="collection-areas">
    <breadcrumb active="Áreas de coleta" />
    <div class="panel">
      <div class="panel-body">
        <list-headline
          name="Áreas de coleta"
          add-url="/areas-de-coleta/cadastrar"
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
                :loading="!collection_areas && !error"
                msg="Carregando lista de áreas"
              />
              <no-item :list="collection_areas" />
              <div v-if="collection_areas && collection_areas.length">
                <b-table
                  stacked="md"
                  :fields="table_fields"
                  :items="collection_areas"
                  :sort-by="'name'"
                  :filter="filters.search"
                >
                  <template #cell(name)="data">
                    <n-link :to="'/areas-de-coleta/' + data.item._id">
                      {{ data.item.name }}
                      <small v-if="data.item.estimated_area">
                        <br />
                        {{ data.item.estimated_area }} hectares
                      </small>
                    </n-link>
                  </template>
                  <template #cell(group)="data">
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
                  <template #cell(address)="data">
                    <span>{{ data.value | city }}</span>
                  </template>
                  <template #cell(vegetations)="data">
                    <span v-if="data.value">{{ data.value.join(', ') }}</span>
                  </template>
                  <template #cell(actions)="data">
                    <n-link
                      v-if="!isSuper"
                      :to="'/areas-de-coleta/' + data.item._id + '/editar'"
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
              <Map :markers="collection_areas" link="/areas-de-coleta" />
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
      collection_areas: [],
      filters: {
        search: null,
      },
      table_fields: [
        {
          key: 'name',
          label: 'Nome da área',
          sortable: true,
        },
        {
          key: 'group',
          label: 'Grupo / Coletor',
          sortable: true,
        },
        {
          key: 'address',
          label: 'Localidade',
          sortable: true,
        },
        {
          key: 'vegetations',
          label: 'Fitofisionomias',
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
        .get('collection_areas', {
          params: {
            populate: 'group collector',
          },
        })
        .then((response) => {
          this.collection_areas = response.data
        })
        .catch(this.showError)
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('collection_areas/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
  },
}
</script>
