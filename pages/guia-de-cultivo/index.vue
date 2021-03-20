<template>
  <div>
    <breadcrumb active="Guia de cultivo" />
    <b-container fluid>
      <b-button block variant="primary" to="/guia-de-cultivo/dicas-basicas">
        Dicas básicas
      </b-button>
      <br />
      <b-button
        block
        variant="primary"
        to="/guia-de-cultivo/planejamento-da-horta"
      >
        Planejamento da Horta
      </b-button>
      <br />
      <b-button block variant="primary" to="/guia-de-cultivo/quando-plantar">
        Quando plantar
      </b-button>
      <br />
      <b-button block variant="primary" to="/guia-de-cultivo/como-plantar">
        Como plantar
      </b-button>
      <br />
      <b-button
        block
        variant="primary"
        to="/guia-de-cultivo/cuidados-com-a-horta"
      >
        Cuidados com a Horta
      </b-button>
      <br />
    </b-container>
    <div class="test">
      <div class="disc"></div>
    </div>
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
