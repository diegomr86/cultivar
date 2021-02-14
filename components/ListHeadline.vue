<template>
  <b-row>
    <b-col sm="6">
      <h2>
        {{ name }}
      </h2>
    </b-col>
    <b-col sm="6" class="text-right">
      <b-button variant="secondary" size="sm" @click="print()">
        <i class="fa fa-print" /> Imprimir
      </b-button>
      <b-button
        v-if="!isSuper && addUrl"
        :to="addUrl"
        variant="primary"
        size="sm"
      >
        <i class="fa fa-plus" /> Cadastrar
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    addUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    print() {
      window.print()
    },
  },
}
</script>
