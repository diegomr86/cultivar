<template>
  <div>
    <breadcrumb active="Bem vindo!" />
    <b-container fluid>
      <b-button
        block
        variant="primary"
        to="/ferramentas/o-que-plantar-esse-mes"
      >
        O que plantar esse mês?
      </b-button>
      <br />
      <b-button block variant="primary" to="/catalogo-de-especies">
        Catálogo de espécies
      </b-button>
      <br />
      <b-button block variant="primary" to="/guia-de-cultivo">
        Guia de cultivo
      </b-button>
      <br />
      <b-button block variant="primary" to="/guia-de-compostagem">
        Guia de compostagem
      </b-button>
      <br />
      <b-button block variant="primary" to="/sobre">
        Sobre a plataforma</b-button
      >
      <br />
      <b-button block variant="primary" to="/colabore"> Colabore </b-button>
    </b-container>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {}
  },
  created() {},
}
</script>
