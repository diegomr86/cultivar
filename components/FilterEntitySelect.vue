<template>
  <div class="filter-entity-select">
    <v-select
      :value="value"
      :options="list"
      label="title"
      :placeholder="placeholder"
      :reduce="(item) => item.id"
      @input="selected"
    >
      <template #option="option">
        <div class="select-item">
          <img v-if="option.picture" :src="baseUrl + option.picture" />
          <div class="desc">
            <strong>{{ option.title }}</strong>
            <br />
            <small>{{ option.description }}</small>
          </div>
          <div class="clearfix"></div>
        </div>
      </template>
    </v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select'
export default {
  name: 'FilterEntitiesSelect',
  components: {
    vSelect,
  },
  props: {
    items: {
      type: Array,
      default: () => null,
    },
    value: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      list: [],
    }
  },
  async created() {
    if (this.items) {
      this.list = [...this.items].sort(function (a, b) {
        return a.title.localeCompare(b.title)
      })
    } else {
      switch (this.type) {
        case 'seeds':
          this.list = (await this.loadList('seeds'))
            .map((seed) => ({
              id: seed._id,
              title: seed.name,
              description: seed.scientific_name,
              picture:
                seed.images && seed.images.length ? seed.images[0].thumb : '',
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'users':
          this.list = (await this.loadList('users'))
            .map((user) => ({
              id: user._id,
              title: user.name,
              email: user.email,
              description: user.nickname,
              picture: user.image ? user.image.thumb : '',
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'groups':
          this.list = (await this.loadList('groups'))
            .map((group) => ({
              id: group._id,
              title: group.name,
              description: this.formatCity(group.address),
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'collectors':
          this.list = (await this.loadList('collectors'))
            .map((collector) => ({
              id: collector._id,
              title: collector.name,
              description: collector.nickname,
              picture: collector.image ? collector.image.thumb : '',
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'clients':
          this.list = (await this.loadList('clients'))
            .map((client) => ({
              id: client._id,
              title: client.name,
              description: client.nickname,
              picture: client.image ? client.image.thumb : '',
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'seeds_houses':
          this.list = (await this.loadList('seeds_houses'))
            .map((seedsHouse) => ({
              id: seedsHouse._id,
              title: seedsHouse.name,
              description: seedsHouse.code,
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
      }
    }
  },
  methods: {
    selected(id) {
      let entity = null
      if (id) {
        entity = this.list.find((item) => item.id === id)
      }
      this.$emit('input', id)
      this.$emit('selected', entity)
    },
  },
}
</script>
