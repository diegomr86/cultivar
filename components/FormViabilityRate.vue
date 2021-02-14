<template>
  <div class="form-viability-rate">
    <div class="row">
      <div class="col-md-4">
        <b-form-group label="De">
          <b-form-input v-model="form.from" type="number" :max="100" />
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Até">
          <b-form-input v-model="form.to" type="number" :max="100" />
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Classificação">
          <b-form-select v-model="form.description" :options="classificacoes" />
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import classificacoes from '@/data/classificacoes.json'
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          from: '',
          to: '',
          description: '',
        }
      },
    },
  },
  data() {
    return {
      classificacoes,
      form: {},
    }
  },
  watch: {
    form() {
      this.$emit('input', this.form)
    },
  },
  created() {
    this.form = this.value
  },
}
</script>
