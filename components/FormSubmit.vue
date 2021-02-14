<template>
  <div class="row">
    <div class="col-sm-12 text-center">
      <b-alert v-if="errors" variant="danger" show>{{ errors }}</b-alert>
      <b-alert
        v-if="veeErrors && veeErrors.items && veeErrors.items.length"
        variant="danger"
        show
        >Verifique os requisitos acima antes de continuar</b-alert
      >
      <div class="btn-group">
        <button v-if="sending" type="button" class="btn btn-default btn-block">
          <i class="fa fa-spinner fa-spin" /> Enviando dados...
        </button>
        <button
          v-if="!sending"
          role="button"
          class="btn btn-primary btn-lg fa fa-save"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormSubmit',
  props: {
    errors: {
      type: Array,
      default: () => null,
    },
    sending: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
