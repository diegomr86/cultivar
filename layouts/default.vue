<template>
  <div id="app">
    <div id="wrapper" class="bg-brown-1">
      <Navbar />
      <div class="d-flex flex-nowrap">
        <div class="d-none d-md-block sidebar-wrapper">
          <Sidebar />
        </div>
        <div class="main bg-white flex-grow-1 pb-4">
          <Nuxt />
        </div>
      </div>
    </div>
    <notifications />
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
}
</script>
