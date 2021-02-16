<template>
  <div class="species">
    <breadcrumb active="Espécies" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Espécies</h1>
          </div>
          <!-- <div class="col-sm-6 main-actions">
          <a @click="downloadXLS" class="btn btn-primary btn-sm" v-if="(species && species.length)">
            <i class="fa fa-download" /> Exportar
          </a>
          <a @click="print()" class="btn btn-primary btn-sm" v-if="(species && species.length)">
            <i class="fa fa-print" /> Imprimir
          </a>
          <n-link to="/cadastrar-especie" class="btn btn-primary btn-sm">
            <i class="fa fa-plus" /> Cadastrar
          </n-link>
        </div> -->
        </div>
        <div class="info-content">
          <div class="filters">
            <b-row>
              <b-col md="4">
                <div class="search">
                  <b-form-input
                    v-model="filters.search"
                    type="search"
                    class="form-control search-input"
                    placeholder="Buscar"
                    @keydown.enter.native="applyFilters"
                    @input="filtersChanged"
                  />
                </div>
              </b-col>
              <b-col md="2">
                <b-form-select
                  v-model="filters.already_tested_in_direct_seedin"
                  :options="[
                    { value: null, text: 'Testadas e não testadas?' },
                    { value: true, text: 'Já testada' },
                    { value: false, text: 'Ainda não testada' },
                  ]"
                  @input="filtersChanged"
                />
              </b-col>
              <b-col md="2">
                <b-form-select
                  v-model="filters.vegetation_type"
                  :options="vegetationTypes"
                  @input="filtersChanged"
                />
              </b-col>
              <b-col md="2">
                <b-form-select
                  v-model="filters.cycle"
                  :options="cycles"
                  @input="filtersChanged"
                />
              </b-col>
              <b-col md="2">
                <b-form-select
                  v-model="filters.presence"
                  :options="estados"
                  @input="filtersChanged"
                />
              </b-col>
            </b-row>
            <div v-if="showFilterButton" class="text-center pb-4">
              <br />
              <b-button variant="primary" block @click="applyFilters"
                >Filtrar</b-button
              >
            </div>
          </div>
          <br />
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!species && !error"
            msg="Carregando lista de espécies"
          />
          <no-item :list="species" />
          <div v-if="species && species.length">
            <div class="text-center">
              <p v-if="species.length === 1">
                <strong>1</strong> ESPÉCIE ENCONTRADA
                <span v-if="filters.category"
                  >em
                  <n-link :to="'/biblioteca?categoria=' + filters.category"
                    ><strong>{{ filters.category }}</strong></n-link
                  ></span
                >
              </p>
              <p v-else>
                <strong>{{ species.length }}</strong> ESPÉCIES ENCONTRADAS
                <span v-if="filters.category"
                  >em
                  <n-link :to="'/biblioteca?categoria=' + filters.category"
                    ><strong>{{ filters.category }}</strong></n-link
                  ></span
                >
              </p>
            </div>
            <table class="table b-table b-table-stacked-md">
              <thead>
                <tr>
                  <!-- <th>Código</th> -->
                  <th>Nome científico</th>
                  <th>Nomes regionais</th>
                  <th>Sementes relacionadas</th>
                  <th v-if="isSuper"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(specie, index) in species">
                  <tr v-if="index < per_page" :key="specie.slug">
                    <!-- <td>
                    <n-link :to="'/especies/'+ specie.slug">{{ specie.code }}</n-link>
                  </td> -->
                    <td>
                      <n-link
                        :to="'/especies/' + specie.slug"
                        :title="'REF: ' + specie.code"
                        >{{ specie.scientific_name }}</n-link
                      >
                    </td>
                    <td>
                      <small>{{ specie.local_name.join(', ') }}</small>
                    </td>
                    <td>
                      <template v-for="seed in specie.seeds">
                        <n-link
                          v-if="currentUser.network === seed.network"
                          :key="seed._id"
                          :to="'/sementes/' + seed._id"
                          >{{ seed.name }}</n-link
                        >
                      </template>
                      <b-button
                        variant="primary"
                        size="sm"
                        class="btn-sm"
                        @click="addSeed(specie)"
                      >
                        <i class="fa fa-plus" /> Semente
                      </b-button>
                    </td>
                    <td v-if="isSuper" class="actions">
                      <n-link
                        :to="'/editar-especie/' + specie.slug"
                        class="fa fa-edit btn btn-secondary btn-sm"
                      ></n-link>
                      <a
                        class="fa fa-trash btn btn-danger btn-sm"
                        @click="remove(specie.slug)"
                      ></a>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div v-if="species.length > per_page">
              <b-button variant="primary" block @click="showMore">
                Mostrar mais
              </b-button>
              <b-button
                v-if="species.length > per_page"
                block
                @click="per_page = species.length"
              >
                Mostrar tudo
              </b-button>
            </div>
          </div>
          <b-modal id="add-seed" hide-footer hide-header>
            <seed-form :specie="currentSpecie" @created="seedCreated" />
          </b-modal>
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
import SeedForm from '@/components/form/SeedForm'
import estados from '@/data/estados.json'
export default {
  name: 'Species',
  components: {
    Loading,
    NoItem,
    Breadcrumb,
    SeedForm,
  },

  data() {
    return {
      estados,
      vegetationTypes: [],
      cycles: [
        { value: null, text: 'Todos os ciclos' },
        '0 - 6 meses',
        'até 3 anos',
        '3 a 10 anos',
        '10 a 20 anos',
        '20 a 100 anos',
        '>100 anos',
      ],
      showFilterButton: false,
      filters: {
        populate: 'seeds',
        search: '',
        already_tested_in_direct_seedin: null,
        vegetation_type: null,
        cycle: null,
        presence: '',
      },
      per_page: 20,
      species: null,
      currentSpecie: null,
    }
  },
  computed: {
    fitofisionomias() {
      const list = {}
      if (this.species) {
        this.species.forEach((specie) => {
          list[specie.origin] = true
        })
      }
      return Object.keys(list)
    },
  },
  created() {
    this.estados[0].text = 'Todos os estados'
    this.list()
  },
  methods: {
    async list() {
      this.per_page = 20
      this.currentError = null
      this.species = (
        await this.$axios.get('species', { params: this.filters })
      ).data
      if (this.vegetationTypes.length === 0) {
        this.loadVegetationTypes()
      }
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('species/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
    addSeed(specie) {
      this.currentSpecie = specie
      this.$bvModal.show('add-seed')
    },
    seedCreated(seed) {
      this.currentSpecie.seeds.push(seed)
      this.$bvModal.hide('add-seed')
    },
    downloadXLS(event) {
      const sheetname = 'Espécies'
      const title = sheetname
      const sheet = [
        [
          'Espécie',
          'Nome científico',
          'Remuneração',
          'Preço Atacado',
          'Preço Varejo',
        ],
      ]
      this.species.forEach((specie) => {
        sheet.push([
          specie.name,
          specie.scientific_name,
          specie.compensation_collect,
          specie.wholesale_price,
          specie.price,
        ])
      })

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
    print() {
      window.print()
    },
    showMore() {
      this.per_page += 20
    },
    filtersChanged() {
      this.showFilterButton = true
    },
    applyFilters() {
      this.list()
    },
    loadVegetationTypes() {
      const vegetationTypes = {}
      if (this.species) {
        this.species.forEach((specie) => {
          specie.vegetation_types.forEach((vegetationType) => {
            vegetationTypes[vegetationType] = true
          })
        })
        this.vegetationTypes = [
          { value: null, text: 'Todos os tipos de vegetação' },
        ].concat(
          Object.keys(vegetationTypes).sort((a, b) => a.localeCompare(b))
        )
      }
    },
  },
}
</script>
