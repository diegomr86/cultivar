import Vue from 'vue'

if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true

  const globalMixin = {
    computed: {
      currentUser() {
        return this.$auth.user
      },
      currentRegion() {
        return this.$store.state.region
      },
    },
    methods: {
      notify(msg, type) {
        this.$notify({
          type: type || 'success',
          text: msg,
        })
      },
      showError(error) {
        if (error.response) {
          if (error.response.data) {
            if (
              error.response.status === 401 &&
              error.response.data.includes('invalid signature')
            ) {
              this.notify('Sessão expirada!', 'error')
              this.$auth.logout()
              this.$router.replace('/')
            } else if (error.response.data.message) {
              this.notify(error.response.data.message, 'error')
            } else {
              this.notify(error.response.data, 'error')
            }
          } else {
            this.notify(error.response, 'error')
          }
        }
      },
    },
  }

  Vue.mixin(globalMixin)
}
