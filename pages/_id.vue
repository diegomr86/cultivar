<template>
  <div v-if="content">
    <breadcrumb :active="content.title" />
    <b-container fluid>
      <nuxt-content :document="content" />
    </b-container>
  </div>
</template>
<script>
export default {
  async asyncData({ $content, route }) {
    const content = await $content(route.params.id).fetch()
    return {
      content,
    }
  },
}
</script>
