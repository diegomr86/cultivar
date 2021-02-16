<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div
      v-if="form.seeds_house && (form.group || form.collector)"
      class="stock-items row"
    >
      <div class="col-sm-6">
        <b-form-group label="Adicionar semente">
          <v-select
            v-if="seeds"
            v-model="item_form.seed"
            :options="seeds"
            label="name"
            :reduce="(item) => item._id"
            placeholder="Selecione a semente"
            @input="seedSelected"
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
        </b-form-group>
      </div>
      <div class="col-sm-3">
        <b-form-group
          v-if="item_form.seed && !seed_error"
          label="Quantidade (Kg) *"
        >
          <b-form-input
            v-model="item_form.qtd"
            type="number"
            step="0.01"
            lang="nb"
            min="0"
            :max="max_qtd"
            name="qtd"
            @input="validateQty"
          />
          <field-error :msg="veeErrors" field="qtd" />
          <small v-if="max_qtd > 0" class="text-muted"
            >Máximo {{ max_qtd | kg }}</small
          >
          <span v-if="max_qtd === 0" class="text-danger"
            >Não existem pedidos pendentes para esta casa/semente</span
          >
        </b-form-group>
      </div>
      <div v-if="item_form.seed && !seed_error && !qtd_error" class="col-sm-3">
        <b-form-group label="Data da coleta">
          <b-form-input v-model="item_form.collection_date" type="date" />
          <span v-if="!item_form.collection_date" class="text-danger"
            >Campo obrigatório</span
          >
        </b-form-group>
      </div>
      <div v-if="item_form.seed && !seed_error && !qtd_error" class="col-sm-6">
        <b-form-group
          v-if="lot_filtered_options.length && !item_form.add_new_lot"
          label="Lote *"
        >
          <form-entity-select
            v-model="item_form.lot"
            :items="lot_filtered_options"
            :validate="'required'"
            name="lot"
          />
          <a class="pointer" @click="newLot">Adicionar novo lote</a>
        </b-form-group>
        <b-form-group
          v-if="!lot_filtered_options.length || item_form.add_new_lot"
          label="Novo lote *"
          description="IMPORTANTE: o nome do lote deve conter, na seguinte ordem: sigla da Casa de Sementes (como CAN ou NX) em que está sendo dada a entrada; 3 a 24 letras do nome popular (como jat-mat OU mirindibinha-mat-do-valdo); Ano de coleta (2019); venda Livre (L) ou venda Restrita (R) à finalidade de restauração ecológica."
        >
          <b-form-input
            v-model="item_form.new_lot"
            v-validate="'required'"
            name="new_lot"
          />
          <field-error :msg="veeErrors" field="new_lot" />
        </b-form-group>
      </div>
      <div v-if="item_form.seed && !seed_error && !qtd_error" class="col-sm-3">
        <b-form-group label="Número de matrizes">
          <b-form-input
            v-model="item_form.number_of_matrixes"
            type="number"
            min="0"
            max="999"
          />
        </b-form-group>
      </div>
      <div v-if="item_form.seed && !seed_error && !qtd_error" class="col-sm-3">
        <b-form-group label="Data da entrada *">
          <b-form-input v-model="item_form.createdAt" type="date" />
          <span v-if="!item_form.createdAt" class="text-danger"
            >Campo obrigatório</span
          >
        </b-form-group>
      </div>
      <div
        v-if="
          item_form.seed &&
          !seed_error &&
          !qtd_error &&
          item_form.collection_date &&
          item_form.qtd > 0
        "
        class="col-sm-12 text-center"
      >
        <b-form-group label="">
          <b-button class="btn btn-primary fa fa-plus" @click="addItem()"
            >Adicionar</b-button
          >
        </b-form-group>
      </div>
      <div v-if="seed_error || qtd_error" class="col-sm-12 text-center">
        <b-alert
          variant="danger"
          show
          v-html="seed_error || qtd_error"
        ></b-alert>
      </div>
    </div>
    <br />
    <br />
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
    <loading :loading="isSending" msg="Adicionando semente" />
    <div
      v-if="seeds && seeds.length && preview && preview.length > 0"
      class="entity-select-preview"
    >
      <table class="table b-table b-table-stacked-md">
        <thead>
          <tr>
            <th>Espécie</th>
            <th>Data</th>
            <th>Lote</th>
            <th>Quantidade</th>
            <th>Remuneração</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item_preview, index) in preview" :key="index">
            <td>
              {{ item_preview.seed.name }}
              <small v-if="item_preview.number_of_matrixes"
                ><br />{{ item_preview.number_of_matrixes }} matrizes</small
              >
            </td>
            <td>
              <span v-if="item_preview.collection_date">{{
                item_preview.collection_date | moment('DD/MM/YYYY')
              }}</span>
            </td>
            <td>
              <small>{{ item_preview.lot }}</small>
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
import FormEntitySelect from '@/components/FormEntitySelect'
import FieldError from '@/components/FieldError'
import utils from '@/components/utils'

export default {
  name: 'FormEntitiesSelect',
  components: {
    vSelect,
    FieldError,
    FormEntitySelect,
    Loading,
  },
  inject: ['$validator'],
  props: {
    value: {
      type: Array,
      default: () => null,
    },
    form: {
      type: Object,
      default: () => null,
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
  },
  methods: {
    emptyForm() {
      return {
        seeds: [],
        requests: [],
        stock_ins: [],
        seed: null,
        form_field: [],
        lots: [],
        lot_filtered_options: [],
        max_qtd: null,
        qtd_error: null,
        seed_error: null,
        item_form: {
          seed: null,
          qtd: 0,
          number_of_matrixes: 0,
          collection_date: '',
          compensation_collect: null,
          price: null,
          wholesale_price: null,
          lot: null,
          new_lot: null,
          add_new_lot: false,
          createdAt: this.$moment(new Date()).format('YYYY-MM-DD'),
        },
      }
    },
    async list() {
      this.seeds = (await this.loadList('seeds')).sort(function (a, b) {
        return a.name.localeCompare(b.name)
      })

      this.$axios
        .$get('lots')
        .then((response) => {
          this.lots = response
        })
        .catch(this.showError)

      this.$axios
        .$get('requests', {
          params: {
            populate: 'seed',
            filters: {
              year: new Date().getFullYear().toString(),
            },
          },
        })
        .then((response) => {
          this.requests = response
        })
        .catch(this.showError)

      this.$axios
        .$get('stock_in', {
          params: {
            filters: {
              year: new Date().getFullYear().toString(),
            },
          },
        })
        .then((response) => {
          this.stock_ins = response
        })
        .catch(this.showError)
    },
    removeItem(index) {
      this.$emit(
        'input',
        this.value.filter((item, i) => i !== index)
      )
    },
    previewItem(item) {
      const seed = this.seeds.find((s) => {
        return s._id === item.seed
      })
      return {
        qtd: item.qtd,
        value: item.compensation_collect,
        lot: this.lotCode(item),
        collection_date: item.collection_date,
        number_of_matrixes: item.number_of_matrixes,
        seed,
      }
    },
    addItem() {
      if (
        this.item_form.seed &&
        this.item_form.qtd &&
        (this.item_form.lot ||
          (this.item_form.add_new_lot && this.item_form.new_lot))
      ) {
        const seed = this.seeds.find((s) => {
          return s._id === this.item_form.seed
        })
        this.item_form.compensation_collect = seed.compensation_collect
        this.item_form.price = seed.price
        this.item_form.wholesale_price = seed.wholesale_price
        this.$emit('input', this.value.concat(this.item_form))
        this.item_form = this.emptyForm().item_form
      }
    },
    seedSelected() {
      if (this.item_form.seed) {
        this.seed = this.seeds.find((seed) => {
          return seed._id === this.item_form.seed
        })
      }
      this.filterOptions()
    },
    filterOptions() {
      this.validateQty()
      this.item_form.add_new_lot = false
      if (this.item_form.seed && this.form.seeds_house) {
        this.lot_filtered_options = this.lots
          .filter((lot) => {
            return (
              lot.seed === this.item_form.seed &&
              lot.seeds_house === this.form.seeds_house
            )
          })
          .map((lot) => ({
            id: lot._id,
            title: lot.code,
          }))
        if (this.lot_filtered_options.length) {
          this.item_form.lot = this.lot_filtered_options[0].id
        } else {
          this.newLot()
        }
      }
    },
    validateQty() {
      this.max_qtd = null
      this.seed_error = ''
      this.qtd_error = ''
      this.currentError = null
      if (
        (this.form.group || this.form.collector) &&
        this.item_form.seed &&
        this.requests
      ) {
        const requests = this.requests.filter((request) => {
          const collector = this.form.collector
          const group = this.form.group
          return (
            ((collector &&
              request.collector &&
              request.collector === collector) ||
              (group && request.group && request.group === group)) &&
            request.seed._id === this.item_form.seed
          )
        })
        if (requests && requests.length) {
          let stockIns = this.stock_ins.filter((stockIn) => {
            const collector = this.form.collector
            const group = this.form.group
            return (
              ((collector &&
                stockIn.collector &&
                stockIn.collector === collector) ||
                (group && stockIn.group && stockIn.group === group)) &&
              stockIn.seed === this.item_form.seed
            )
          })
          let stockInsTotal = 0
          if (stockIns.length) {
            stockIns = stockIns.map((stockIn) => stockIn.qtd)
            stockInsTotal = parseFloat(stockIns.reduce((a, b) => a + b, 0))
          }

          const requestTotal = parseFloat(
            requests.reduce((a, b) => a + b.qtd, 0)
          )
          this.max_qtd = requestTotal - stockInsTotal

          if (this.max_qtd < parseFloat(this.item_form.qtd)) {
            this.qtd_error =
              'Quantidade ' +
              this.$options.filters.kg(this.item_form.qtd) +
              ' maior que a solicitada nos pedidos: ' +
              this.$options.filters.kg(this.max_qtd)
            return false
          } else {
            return true
          }
        } else {
          this.seed_error =
            'Não existe registro de pedido dessa semente para este coletor/grupo'
          return false
        }
      } else {
        if (!this.form.group && !this.form.collector) {
          this.currentError = 'Selecione um grupo ou coletor'
        }
        return false
      }
    },
    newLot() {
      this.item_form.add_new_lot = true
      this.item_form.lot = null
      this.item_form.new_lot = utils.generateCode([
        this.$parent.seeds_house_code,
        this.seed.name,
      ])
    },
    lotCode(itemForm) {
      if (itemForm.lot) {
        const lot = this.lots.find((lot) => {
          return itemForm.lot === lot._id
        })
        if (lot) {
          return lot.code
        }
      }
      return itemForm.new_lot
    },
  },
}
</script>
