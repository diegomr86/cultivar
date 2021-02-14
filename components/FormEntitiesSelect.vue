<template>
  <div>
    <v-select
      v-model="entity"
      :options="list"
      label="title"
      placeholder="Busque pelo nome clique para adicionar à lista"
      @input="addItem"
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
    <div v-if="preview && preview.length > 0" class="entity-select-preview">
      <h5>Selecionados:</h5>
      <div class="list-group">
        <div
          v-for="(item_preview, index) in preview"
          :key="index"
          class="list-group-item"
        >
          <div>
            <img
              v-if="item_preview && item_preview.picture"
              :src="baseUrl + item_preview.picture"
            />
            <span v-if="item_preview">{{ item_preview.title }}</span>
            <b-button
              v-if="item_preview"
              class="btn btn-sm btn-danger fa fa-trash pull-right"
              @click="removeItem(item_preview.id)"
            ></b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  name: 'FormEntitiesSelect',
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
      type: Array,
      default: () => null,
    },
  },
  data() {
    return {
      list: [],
      entity: null,
    }
  },
  computed: {
    preview() {
      if (this.value && this.list) {
        return this.value
          .map((selected) => {
            return this.getItem(selected)
          })
          .filter((preview) => preview)
      }
      return []
    },
  },
  async created() {
    if (this.items) {
      this.list = [...this.items].sort(function (a, b) {
        return a.title.localeCompare(b.title)
      })
    } else {
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
      }
    }
  },
  methods: {
    addItem() {
      if (!this.value.find((item) => item === this.entity.id)) {
        this.$emit('input', this.value.concat(this.entity.id))
      }
      this.entity = null
    },
    removeItem(id) {
      this.$emit(
        'input',
        this.value.filter((item) => item !== id)
      )
    },
    getItem(id) {
      return this.list.find((i) => {
        return i.id === id
      })
    },
  },
}
</script>
