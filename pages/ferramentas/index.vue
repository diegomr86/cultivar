<template>
  <div>
    <breadcrumb active="Ferramentas" />
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
        Catálogo de hortaliças
      </b-button>
      <br />
    </b-container>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
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
