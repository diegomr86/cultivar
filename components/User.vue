<!-- eslint-disable vue/no-v-html -->
<template>
  <span>
    <!-- <n-link v-if="profile" :to="'/membro/' + profile.id"> -->
    <span v-if="profile">
      <b-avatar
        v-if="profile.picture && profile.picture.url"
        v-b-tooltip.hover
        :title="userLabel(profile)"
        :src="profile.picture.url"
        class="mr-1"
        size="2rem"
        :alt="userLabel(profile)"
      />
      <b-avatar
        v-else-if="profile.code"
        class="mr-1"
        size="2rem"
        :alt="userLabel(profile)"
        :text="profile.code"
      />
      <b-avatar v-else class="mr-1" size="2rem" />
    </span>
    <b-avatar v-else class="mr-1" size="2rem" />
    <!-- </n-link> -->
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
    if (!this.profile && this.id) {
      this.profile = await this.$axios.$get('/api/users/' + this.id)
    }
  },
}
</script>
