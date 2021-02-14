<template>
  <button v-if="loading" type="button" class="alert alert-default w-100">
    <i class="fa fa-spinner fa-spin" />
    {{ msg ? msg : 'Carregando dados' }}...
  </button>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      default: '',
    },
  },
}
</script>
