<template>
  <div>
    <breadcrumb
      :links="[['Catálogo de espécies', '/catalogo-de-especies']]"
      :active="especie.nome"
      :description="especie.descricao"
      :img="
        'https://www.cultivarbrasil.com' +
        require('~/assets/img/plants/' + especie.slug + '.png')
      "
    />
    <b-container fluid>
      <div class="item">
        <h2>{{ especie.nome_popular }}</h2>
        <p>{{ especie.nome_cientifico }}</p>
      </div>
      <div class="item item-body">
        <div class="img-wrapper">
          <img :src="require('~/assets/img/plants/' + especie.slug + '.png')" />
        </div>
        <p>{{ especie.descricao }}</p>
        <h4>Recomendações de aproveitamento</h4>
        <p>{{ especie.aproveitamento }}</p>
        <h4>Época e regiões para plantio</h4>
        <b-row class="plantio-table" fluid>
          <b-col class="{active: (currentRegion == 'Centro-oeste')}">
            <p>C. Oeste</p>
            <p>{{ especie.plantio['Centro-oeste'] }}</p>
          </b-col>
          <b-col class="{active: (currentRegion == 'Nordeste')}">
            <p>Nordeste</p>
            <p>{{ especie.plantio['Nordeste'] }}</p>
          </b-col>
          <b-col class="{active: (currentRegion == 'Norte')}">
            <p>Norte</p>
            <p>{{ especie.plantio['Norte'] }}</p>
          </b-col>
          <b-col class="{active: (currentRegion == 'Sudeste')}">
            <p>Sudeste</p>
            <p>{{ especie.plantio['Sudeste'] }}</p>
          </b-col>
          <b-col class="{active: (currentRegion == 'Sul')}">
            <p>Sul</p>
            <p>{{ especie.plantio['Sul'] }}</p>
          </b-col>
        </b-row>
        <p
          class="text-right table-legend"
          ng-if="especie.plantio.indexOf('*') >= 0"
        >
          * Cultivo não recomendado.
        </p>
        <p>{{ especie.epoca_regiao }}</p>
        <h4>Colheita:</h4>
        <p>{{ especie.colheita }} dias</p>
        <h4>Plantas companheiras:</h4>
        <p>
          <span
            v-for="companheira in especie.companheiras.split(', ')"
            :key="companheira"
          >
            <n-link
              v-if="specieByName(companheira)"
              class="badge badge-primary"
              :to="'/catalogo-de-especies/' + specieByName(companheira).slug"
              >{{ specieByName(companheira).nome }}</n-link
            >
            <span v-else class="badge badge-default">{{ companheira }}</span>
          </span>
        </p>
      </div>
    </b-container>
  </div>
</template>
<script>
// import meses from '@/data/meses.json'
import especies from '@/data/especies.json'
export default {
  computed: {
    especie() {
      const slug = this.$route.params.id
      return especies.find((especie) => especie.slug === slug)
    },
  },
  methods: {
    specieByName(name) {
      return especies.find((especie) => {
        return especie.nome.toLowerCase() === name.toLowerCase()
      })
    },
  },
}
</script>
