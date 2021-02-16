<template>
  <span>
    <b-button :variant="variant" @click="modalShow = !modalShow">
      <i v-if="showIcon" class="fas fa-map-marker-alt" />
      {{ currentRegion ? 'Região ' + currentRegion : 'Qual a sua região?' }}
    </b-button>
    <b-modal
      v-model="modalShow"
      title="Qual a sua região?"
      ok-only
      ok-title="Fechar"
    >
      <div>
        <b-button
          :variant="currentRegion === 'Centro-oeste' ? 'primary' : 'secondary'"
          block
          @click="setRegion('Centro-oeste')"
        >
          Centro-oeste
        </b-button>
        <b-button
          :variant="currentRegion === 'Nordeste' ? 'primary' : 'secondary'"
          block
          @click="setRegion('Nordeste')"
        >
          Nordeste
        </b-button>
        <b-button
          :variant="currentRegion === 'Norte' ? 'primary' : 'secondary'"
          block
          @click="setRegion('Norte')"
        >
          Norte
        </b-button>
        <b-button
          :variant="currentRegion === 'Sudeste' ? 'primary' : 'secondary'"
          block
          @click="setRegion('Sudeste')"
        >
          Sudeste
        </b-button>
        <b-button
          :variant="currentRegion === 'Sul' ? 'primary' : 'secondary'"
          block
          @click="setRegion('Sul')"
        >
          Sul
        </b-button>
        <b-button
          :variant="!currentRegion ? 'primary' : 'secondary'"
          block
          @click="setRegion()"
        >
          Brasil todo
        </b-button>
      </div>
    </b-modal>
  </span>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      modalShow: false,
    }
  },
  methods: {
    setRegion(region) {
      this.$store.commit('setRegion', region)
      this.modalShow = false
    },
  },
}
</script>
