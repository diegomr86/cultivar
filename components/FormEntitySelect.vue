<template>
  <div>
    <v-select
      v-model="entity"
      v-validate="validate"
      :options="list"
      label="title"
      name="formEntitySelect"
      :placeholder="placeholder || 'Busque pelo nome clique para selecionar'"
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
      <template #selected-option="option">
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
    <span v-for="(err, index) in veeErrors" :key="index">
      <span v-if="err.field === 'formEntitySelect'" class="text-danger">{{
        err.msg
      }}</span>
    </span>
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  name: 'FormEntitySelect',
  components: {
    vSelect,
  },
  inject: ['$validator'],
  props: {
    items: {
      type: Array,
      default: () => null,
    },
    type: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: () => null,
    },
    validate: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    filter: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      list: [],
      entity: null,
    }
  },
  watch: {
    items(newVal) {
      this.list = newVal
    },
  },
  async created() {
    if (this.items) {
      this.list = [...this.items].sort(function (a, b) {
        return a.title.localeCompare(b.title)
      })
    } else {
      const filterItem = this.filter ? { filters: this.filter } : null

      switch (this.type) {
        case 'networks':
          this.list = (await this.loadList('networks'))
            .map((network) => ({
              id: network._id,
              title: network.name,
              description: network.domain_name,
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'authors':
          this.list = (
            await this.loadList('authors', { select: 'name description' })
          ).map((specie) => ({
            id: specie._id,
            title: specie.name,
            description: specie.description,
          }))
          break
        case 'species':
          this.list = (
            await this.loadList('species', {
              select: 'scientific_name local_name pictures',
            })
          )
            .map((specie) => ({
              id: specie._id,
              title: specie.scientific_name,
              description: specie.local_name.join(', '),
              picture:
                specie.images && specie.images.length
                  ? specie.images[0].thumb
                  : '',
              images: specie.images,
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'seeds':
          this.list = (await this.loadList('seeds', filterItem))
            .map((seed) => ({
              id: seed._id,
              title: seed.name,
              description: seed.scientific_name,
              picture:
                seed.images && seed.images.length ? seed.images[0].thumb : '',
              compensation_collect: seed.compensation_collect,
              wholesale_price: seed.wholesale_price,
              price: seed.price,
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'users':
          this.list = (await this.loadList('users', filterItem))
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
          this.list = (await this.loadList('groups', filterItem))
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
          this.list = (await this.loadList('collectors', filterItem))
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
          this.list = (await this.loadList('clients', filterItem))
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
          this.list = (await this.loadList('seeds_houses', filterItem))
            .map((seedsHouse) => ({
              id: seedsHouse._id,
              title: seedsHouse.name,
              description: seedsHouse.code,
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
        case 'orders':
          this.list = (await this.loadList('orders', filterItem))
            .map((order) => ({
              id: order._id,
              title: 'Encomenda ' + order.code,
              description: order.date_receiving
                ? this.$moment(order.date_receiving).format('DD/MM/YYYY')
                : '',
            }))
            .sort(function (a, b) {
              return a.title.localeCompare(b.title)
            })
          break
      }
    }
    if (this.value && this.value) {
      this.entity = this.list.find((item) => {
        return item.id === this.value
      })
    }
  },
  methods: {
    selected() {
      if (this.entity) {
        this.$emit('input', this.entity.id)
      } else {
        this.$emit('input', null)
      }
      this.$emit('selected', this.entity)
    },
  },
}
</script>
