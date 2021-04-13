<!-- eslint-disable vue/no-v-html -->
<template>
  <span>
    <pre>{{ profile }}aa</pre>
    <n-link v-if="profile" :to="'/membro/' + profile.id">
      <b-avatar
        v-if="profile.picture && profile.picture.url"
        :src="profile.picture.url"
        class="mr-1"
        size="2rem"
        :alt="profile.name"
      />
      <b-avatar v-else class="mr-1" size="2rem" :alt="profile.name" />
    </n-link>
  </span>
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
