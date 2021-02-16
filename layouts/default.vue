<template>
  <div id="app">
    <div id="wrapper" class="bg-brown-1">
      <Navbar />
      <b-row no-gutters>
        <b-col md="3" fluid class="sidebar-wrapper d-none d-md-block">
          <Sidebar />
        </b-col>
        <b-col class="main bg-white pb-4">
          <Nuxt />
        </b-col>
      </b-row>
    </div>
    <client-only>
      <notifications />
    </client-only>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default {
  components: {
    Navbar,
    Sidebar,
  },
  created() {
    if (this.$route.query.regiao) {
      this.$store.commit('setRegion', this.$route.query.regiao)
    }
  },
}
</script>
