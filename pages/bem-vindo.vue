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
      <b-button block variant="primary" to="/sobre">
        Sobre a plataforma</b-button
      >
      <br />
      <b-button block variant="primary" to="/colabore"> Colabore </b-button>
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
