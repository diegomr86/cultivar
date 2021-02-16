<template>
  <div>
    <div class="seeds-select">
      <b-form-group label="Adicionar semente">
        <v-select
          v-if="seeds"
          v-model="item_form.seed"
          :options="seeds"
          label="name"
          placeholder="Selecione a semente"
          class="col-sm-6"
          @keypress.13.prevent="addItem"
        >
          <template #option="option">
            <div class="select-item">
              <img
                v-if="option.images && option.images.length"
                :src="baseUrl + option.images[0].url"
              />
              <div class="desc">
                <strong>{{ option.name }}</strong>
                <br />
                <small>{{ option.scientific_name }}</small>
              </div>
              <div class="clearfix"></div>
            </div>
          </template>
        </v-select>
        <div class="col-sm-6">
          <input
            v-model="item_form.qtd"
            class="weight"
            placeholder="Quantidade"
            type="number"
            step="0.01"
            lang="nb"
            min="0"
            @keypress.13.prevent="addItem"
          />
          Kg
          <b-button
            class="btn btn-primary fa fa-plus pull-right"
            @click="addItem()"
            >Adicionar</b-button
          >
        </div>
        <br />
        <br />
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isSending" msg="Adicionando semente" />
      </b-form-group>
    </div>
    <div
      v-if="seeds && seeds.length && preview && preview.length > 0"
      class="entity-select-preview"
    >
      <table class="table b-table b-table-stacked-md">
        <thead>
          <tr>
            <th>Espécie</th>
            <th>Valor / Kg</th>
            <th>Quantidade</th>
            <th v-if="!basecalc || basecalc === 'price'">Valor (varejo)</th>
            <th v-if="basecalc === 'wholesale_price'">Valor (atacado)</th>
            <th v-if="basecalc === 'compensation_collect'">Remuneração</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item_preview, index) in preview" :key="index">
            <td>
              {{ item_preview.seed.name }}
            </td>
            <td>
              {{ item_preview.value | moeda }}
            </td>
            <td>
              {{ item_preview.qtd | kg }}
            </td>
            <td>
              {{ (item_preview.value * item_preview.qtd) | moeda }}
            </td>
            <td class="text-right">
              <b-button
                v-if="item_preview"
                class="btn btn-sm btn-danger fa fa-trash"
                @click="removeItem(index)"
              ></b-button>
            </td>
          </tr>
          <tr class="b-table-bottom-row">
            <td></td>
            <td text-right>
              <strong>Totais:</strong>
            </td>
            <td>
              <strong>{{ totalQty | kg }}</strong>
            </td>
            <td>
              <strong>{{ totalPrice | moeda }}</strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Loading from '@/components/Loading'

export default {
  name: 'FormEntitiesSelect',
  components: {
    vSelect,
    Loading,
  },
  inject: ['$validator'],
  props: {
    value: {
      type: Array,
      default: () => null,
    },
    basecalc: {
      type: String,
      default: null,
    },
  },
  data() {
    return this.emptyForm()
  },
  computed: {
    preview() {
      if (this.value) {
        return this.value
          .map((selected) => {
            return this.previewItem(selected)
          })
          .filter((preview) => preview)
      }
      return []
    },
    totalQty() {
      if (this.preview) {
        return this.preview
          .map((item) => parseFloat(item.qtd))
          .reduce((a, b) => a + b, 0)
      } else {
        return 0
      }
    },
    totalPrice() {
      if (this.preview) {
        return this.preview
          .map((item) => parseFloat(item.value) * parseFloat(item.qtd))
          .reduce((a, b) => a + b, 0)
      } else {
        return 0
      }
    },
  },
  created() {
    this.list()
    if (this.formEditing()) {
      this.edit()
    }
  },
  methods: {
    emptyForm() {
      return {
        seeds: [],
        item_form: {
          seed: null,
          qtd: null,
          compensation_collect: null,
          price: null,
          wholesale_price: null,
        },
      }
    },
    async list() {
      this.seeds = (await this.loadList('seeds')).sort(function (a, b) {
        return a.name.localeCompare(b.name)
      })
    },
    removeItem(index) {
      this.$emit(
        'input',
        this.value.filter((item, i) => i !== index)
      )
    },
    previewItem(item) {
      const seed = this.seeds.find((s) => {
        return s._id === item.seed._id
      })
      return {
        qtd: item.qtd,
        value: item[this.basecalc || 'price'],
        seed,
      }
    },
    addItem() {
      if (this.item_form.seed && this.item_form.qtd) {
        const currentItem = this.value.find((seedItem) => {
          return seedItem.seed === this.item_form.seed
        })

        if (currentItem) {
          this.$emit(
            'input',
            this.value.map((seedItem) => {
              if (seedItem.seed === this.item_form.seed) {
                seedItem.qtd =
                  parseFloat(this.item_form.qtd) + parseFloat(currentItem.qtd)
              }
              return seedItem
            })
          )
        } else {
          const seed = this.seeds.find((s) => {
            return s._id === this.item_form.seed._id
          })
          this.item_form.compensation_collect = seed.compensation_collect
          this.item_form.price = seed.price
          this.item_form.wholesale_price = seed.wholesale_price
          this.$emit('input', this.value.concat(this.item_form))
        }

        this.item_form = this.emptyForm()
      }
    },
  },
}
</script>
