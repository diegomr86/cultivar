<template>
  <div class="map">
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 100vh"
      :options="{ scrollWheelZoom: false }"
    >
      <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      <l-marker
        v-for="marker in markers"
        :key="marker._id"
        :lat-lng="[marker.geolocation.lat, marker.geolocation.lng]"
      >
        <l-popup>
          <h2>{{ marker.name }}</h2>
          <p v-if="marker.address">
            <small>{{
              [marker.address.city, marker.address.uf].join(', ')
            }}</small>
          </p>
          <p>{{ marker.description }}</p>
          <p>
            <n-link :to="link + '/' + marker._id">Mais detalhes</n-link>
          </p>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { Icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  props: {
    markers: {
      type: Array,
      default: () => null,
    },
    link: {
      type: String,
      default: '',
    },
    zoom: {
      type: Number,
      default: 4,
    },
    center: {
      type: Array,
      default: () => [-17, -55],
    },
  },
}
</script>
