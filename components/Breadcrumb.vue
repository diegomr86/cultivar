<template>
  <div class="breadcrumb-wrapper">
    <ol class="breadcrumb">
      <li>
        <n-link to="/bem-vindo"><i class="fa fa-home" /> </n-link>
      </li>
      <li v-for="(link, index) in links" :key="index">
        <n-link :to="link[1]">{{ link[0] }}</n-link>
      </li>
      <li v-if="active" class="active">{{ active }}</li>
    </ol>
    <div v-if="phase" class="moon" @click="show_moon_info = !show_moon_info">
      <div class="earth" :style="moonStyle"></div>
    </div>
    <b-container v-if="show_moon_info || $route.path === '/bem-vindo'">
      <div v-if="moon_phase === 'nova'" class="item item-body text-center">
        <h3>Hoje é dia de Lua nova</h3>
        <small v-if="next_moon > 1">
          Faltam {{ Math.ceil(next_moon) }} dias para o quarto crescente</small
        >
        <small v-else> Amanhã já entra o quarto crescente</small>
        <br />
        <div class="img-wrapper">
          <b-img src="~assets/img/home-lua-nova.png"></b-img>
        </div>
        <p>
          <br />Nessa fase a seiva manifesta-se em maior quantidade no caule, em
          direção aos ramos
        </p>
        <p>
          <strong>Fase boa para:</strong> colheita de raízes (cenoura, nabo,
          beterraba, rabanete, etc) e podas de limpeza e produção de matéria
          seca.
        </p>
      </div>
      <div v-if="moon_phase === 'crescente'" class="item item-body text-center">
        <h3>Hoje é dia de Lua crescente</h3>
        <small v-if="next_moon > 1">
          Faltam {{ Math.ceil(next_moon) }} dias para a Lua cheia</small
        >
        <small v-else> Amanhã já entra a Lua cheia</small>
        <br />
        <div class="img-wrapper">
          <b-img src="~assets/img/home-lua-crescente.png"></b-img>
        </div>
        <p>
          <br />Nessa fase a seiva está presente em maior quantidade no caule,
          nos ramos e nas folhas.
        </p>
        <p>
          <strong>Fase boa para:</strong> plantar tomate, pimentão, jiló,
          quiabo, berinjela, feijão – vagem, pepino, abóbora, milho, arroz,
          feijão e outras, sejam frutíferas, legumes ou cereais. Ideal para poda
          para brotação rápida.
        </p>
      </div>
      <div v-if="moon_phase === 'cheia'" class="item item-body text-center">
        <h3>Hoje é dia de Lua cheia</h3>
        <small v-if="next_moon > 1">
          Faltam {{ Math.ceil(next_moon) }} dias para o quarto minguante</small
        >
        <small v-else> Amanhã já entra o quarto minguante</small>
        <br />
        <div class="img-wrapper">
          <b-img src="~assets/img/home-lua-cheia.png"></b-img>
        </div>
        <p>
          <br />Nessa fase a seiva manifesta-se em maior quantidade na copa da
          planta (ramos e folhas).
        </p>
        <p>
          <strong>Fase boa para:</strong> colheita de frutos e hortaliças de
          folha. No início desta fase planta-se: repolho, couve-flor, alface e
          outras. Além das hortaliças esta fase é ótima para o plantio de
          flores.
        </p>
      </div>
      <div v-if="moon_phase === 'minguante'" class="item item-body text-center">
        <h3>Hoje é dia de Lua minguante</h3>
        <small v-if="next_moon > 1">
          Faltam {{ Math.ceil(next_moon) }} dias para a lua nova</small
        >
        <small v-else> Amanhã já entra a lua nova</small>
        <br />
        <div class="img-wrapper">
          <b-img src="~assets/img/home-lua-minguante.png"></b-img>
        </div>
        <p>
          <br />Nessa fase a planta absorve menos quantidade de seiva no caule,
          nas folhas e nos ramos.
        </p>
        <p>
          <strong>Fase boa para:</strong> plantar raízes como rabanetes,
          beterraba, cenoura, inhame, batata, cebola de cabeça. Ideal para tirar
          bambus, madeiras para construção e cabos para ferramentas.
        </p>
      </div>
      <hr />
    </b-container>
  </div>
</template>

<script>
import lune from 'lune'
export default {
  name: 'Breadcrumb',
  props: {
    links: {
      type: Array,
      default: () => null,
    },
    active: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      time: 0,
      phase: null,
      moon_phase: null,
      next_moon: null,
      show_moon_info: false,
    }
  },
  computed: {
    moonStyle() {
      if (this.phase) {
        const phase = this.phase.phase * 100
        if (phase < 50) {
          return 'margin-left: ' + this.phase.illuminated * 100 * -1 + '%'
        } else {
          return 'margin-left: ' + this.phase.illuminated * 100 + '%'
        }
      }
      return ''
    },
  },
  created() {
    const today = new Date()
    today.setDate(today.getDate())
    this.phase = this.calcMoonPhase(today)
  },
  methods: {
    calcMoonPhase(date) {
      const currentPhase = lune.phase(date)
      const recentPhases = lune.phase_hunt(date)
      const phase = currentPhase.phase * 100
      if (phase < 25) {
        this.moon_phase = 'nova'
        this.next_moon = this.diffDates(date, new Date(recentPhases.q1_date))
      } else if (phase < 50) {
        this.moon_phase = 'crescente'
        this.next_moon = this.diffDates(date, new Date(recentPhases.full_date))
      } else if (phase < 75) {
        this.moon_phase = 'cheia'
        this.next_moon = this.diffDates(date, new Date(recentPhases.q3_date))
      } else {
        this.moon_phase = 'minguante'
        this.next_moon = this.diffDates(
          date,
          new Date(recentPhases.nextnew_date)
        )
      }

      return currentPhase
    },
    diffDates(date1, date2) {
      return (date2 - date1) / (1000 * 60 * 60 * 24)
    },
  },
}
</script>
