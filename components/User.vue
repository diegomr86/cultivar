<!-- eslint-disable vue/no-v-html -->
<template>
  <n-link v-if="profile" :to="'/membro/' + profile.id">
    <b-avatar
      :src="profile.picture.url"
      class="mr-1"
      size="2rem"
      :alt="profile.name"
    />
  </n-link>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      profile: this.user,
    }
  },
  async created() {
    if (!this.profile) {
      this.profile = await this.$axios.$get('/users/' + this.id)
    }
  },
}
</script>
