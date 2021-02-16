<template>
  <div>
    <breadcrumb
      :links="[['Ferramentas', '/ferramentas']]"
      active="Catálogo de espécies"
    />
    <b-container fluid>
      <div class="text-center">
        <p>
          Espécies mais cultivadas no
          <strong>{{ currentRegion || 'Brasil' }}</strong>
        </p>
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
import especies from '@/data/especies.json'
export default {
  computed: {
    especies() {
      return especies.filter(
        (especie) => especie.plantio[this.currentRegion] !== '*'
      )
    },
  },
}
</script>
