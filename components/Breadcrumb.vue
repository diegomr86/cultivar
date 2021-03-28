<template>
  <div class="breadcrumb-wrapper">
    <ol class="breadcrumb">
      <li>
        <n-link to="/"><i class="fa fa-home" /> </n-link>
      </li>
      <li v-for="(link, index) in links" :key="index">
        <n-link :to="link[1]">{{ link[0] }}</n-link>
      </li>
      <li v-if="active" class="active">{{ active }}</li>
    </ol>
    <Moon />
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      default: () => null,
    },
    active: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
  },
  head() {
    const meta = [
      // hid is used as unique identifier. Do not use `vmid` for it as it will not work
      {
        hid: 'description',
        name: 'description',
        content: this.pageDescription(),
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: this.pageDescription(),
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: this.pageTitle(),
      },
    ]
    if (this.img) {
      meta.push({
        hid: 'og:image',
        name: 'og:image',
        content: this.img,
      })
    }
    return {
      title: this.pageTitle(),
      meta,
    }
  },
  created() {
    this.$store.commit('setPageTitle', this.pageTitle())
    this.$store.commit('setPageDescription', this.pageDescription())
  },
  methods: {
    pageTitle() {
      const links = this.links || []
      const title = [
        'Cultivar Brasil',
        ...links.map((link) => link[0]),
        this.active,
      ]
      return title.reverse().join(' | ')
    },
    pageDescription() {
      return this.description || process.env.npm_package_description
    },
  },
}
</script>
