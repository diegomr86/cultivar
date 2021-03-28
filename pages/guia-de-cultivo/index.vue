<template>
  <div>
    <breadcrumb
      active="Guia básico de cultivo"
      description="Pra cultivar plantas e alimentos saudáveis é preciso oferecer atenção, cuidado e dedicação, mas os benefícios que essa prática trará pra sua saúde física, mental, emocional e psicológica são muitos."
      :img="
        'https://www.cultivarbrasil.com' +
        require('~/assets/img/guia-de-cultivo/guia-de-cultivo.png')
      "
    />
    <b-container fluid class="guide">
      <div class="img-wrapper">
        <img src="~assets/img/guia-de-cultivo/guia-de-cultivo.png" />
      </div>
      <br />
      <p class="text-center">
        Pra cultivar plantas e alimentos saudáveis é preciso oferecer atenção,
        cuidado e dedicação, mas os benefícios que essa prática trará pra sua
        saúde física, mental, emocional e psicológica são muitos.
      </p>
      <p class="text-center">
        A seguir você encontra informações importantes pra saber como começar!
      </p>
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
      <b-button block variant="primary" to="/guia-de-cultivo/dicas-basicas">
        Dicas básicas
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
