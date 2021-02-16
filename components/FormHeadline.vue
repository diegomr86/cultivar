<template>
  <div class="row">
    <div class="col-md-8">
      <h1>{{ formEditing() ? 'Editar' : 'Cadastrar' }} {{ name }}</h1>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormHeadline',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
}
</script>
