<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <b-media class="pt-2">
      <template #aside>
        <User :user="$auth.user" />
      </template>
      <p>
        <User :user="$auth.user" />
        <b-form-textarea
          v-model="form.message"
          :placeholder="form.comment ? 'Responder' : 'Adicione um comentário'"
        />
        <b-btn v-if="form.message" block class="mt-2" @click="save">
          Salvar comentário
        </b-btn>
      </p>
    </b-media>
  </div>
</template>
<script>
export default {
  props: {
    comment: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        organization: 'terrakrya',
        comment: this.comment,
        target: this.target,
        message: null,
      },
    }
  },
  methods: {
    async save() {
      if (this.form.message) {
        const comment = await this.$axios.$post('/comments', this.form)
        if (comment) {
          this.$toast.success('Comentário enviado!')
          this.$emit('change', comment)
          this.form.message = null
        }
      }
    },
  },
}
</script>
