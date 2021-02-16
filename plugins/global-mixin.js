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
  }

  Vue.mixin(globalMixin)
}
