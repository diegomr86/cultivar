<template>
  <div>
    <breadcrumb :active="content.title" />
    <b-container fluid>
      <nuxt-content :document="content" />
    </b-container>
  </div>
</template>
<script>
export default {
  async asyncData({ $content, route }) {
    console.log(route.params)
    const content = await $content(route.params.id).fetch()
    console.log(content)
    return {
      content,
    }
  },
}
</script>
