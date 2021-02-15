<template>
  <div>
    <breadcrumb
      :links="[['Ferramentas', '/ferramentas']]"
      active="O que plantar esse mês?"
    />
    <b-container fluid>
      <div class="text-center">
        <h3 class="text-center">{{ currentMonth.name }}</h3>
        <p>{{ currentMonth.description }}</p>
        <p>Confira abaixo algumas sugestões para este mês:</p>
      </div>
      <ul class="list-unstyled">
        <b-media
          v-for="especie in especies"
          :key="especie.id"
          tag="li"
          class="border-top pt-3"
        >
          <template #aside>
            <n-link :to="'/catalogo-de-especies/' + especie.slug">
              <b-img
                :src="require('~/assets/img/plants/' + especie.slug + '.png')"
                width="64"
                alt="placeholder"
              />
            </n-link>
          </template>
          <h5 class="mb-1">
            <n-link :to="'/catalogo-de-especies/' + especie.slug">{{
              especie.nome
            }}</n-link>
          </h5>
          <p>
            {{ especie.nome_cientifico }}
          </p>
        </b-media>
      </ul>
    </b-container>
  </div>
</template>
<script>
import meses from '@/data/meses.json'
import especies from '@/data/especies.json'
export default {
  computed: {
    especies() {
      return especies.filter((especie) => {
        if (especie.plantio[this.currentRegion] === 'ano todo') return true
        if (especie.plantio[this.currentRegion] === '*') {
          return false
        } else {
          const plantio = especie.plantio[this.currentRegion].split('-')
          const plantio1 = meses.find((mes) => mes.code === plantio[0]).number
          const plantio2 = meses.find((mes) => mes.code === plantio[1]).number

          if (plantio1 <= plantio2) {
            if (
              this.currentMonth.number >= plantio1 &&
              this.currentMonth.number <= plantio2
            ) {
              return true
            }
          } else if (
            this.currentMonth.number >= plantio1 &&
            this.currentMonth.number <= 12 &&
            this.currentMonth.number >= 1 &&
            this.currentMonth.number <= plantio2
          ) {
            return true
          }
        }
        return false
      })
    },
    currentMonth() {
      const month = new Date().getMonth() + 1
      return meses.find((mes) => mes.number === month)
    },
  },
}
</script>
