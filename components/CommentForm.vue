<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <b-media class="pt-2" no-body>
      <b-media-aside>
        <User v-if="$auth.loggedIn" :user="currentUser" />
        <User v-else />
      </b-media-aside>
      <b-media-body>
        <b-form-textarea
          v-if="$auth.loggedIn"
          v-model="form.message"
          :placeholder="form.comment ? 'Responder' : 'Deixe seu comentário'"
        />
        <b-btn v-else block @click="$bvModal.show('login-modal')">
          Deixe seu comentário
        </b-btn>
        <b-btn
          v-if="form.message"
          variant="primary"
          block
          class="mt-2"
          @click="save"
        >
          Salvar comentário
        </b-btn>
      </b-media-body>
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
        const comment = await this.$axios.$post('/api/comments', this.form)
        if (comment) {
          this.notify('Comentário enviado!')
          this.$emit('change', comment)
          this.form.message = null
        }
      }
    },
  },
}
</script>
