<template>
  <div v-if="list && list.length === 0" class="no-item text-center">
    {{ msg ? msg : 'Nenhum ítem encontrado' }}
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => null,
    },
    msg: {
      type: String,
      default: '',
    },
  },
}
</script>
