<template>
  <span v-show="msg.has(field)" class="text-danger">{{
    msg.first(field)
  }}</span>
</template>

<script>
export default {
  name: 'FieldError',
  props: {
    msg: {
      type: Object,
      default: () => null,
    },
    field: {
      type: String,
      default: null,
    },
  },
}
</script>
