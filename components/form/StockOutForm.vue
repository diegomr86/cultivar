<template>
  <div class="stock-in-form">
    <breadcrumb :links="[['Estoque', '/estoque']]" active="Saída de estoque" />
    <div class="panel">
      <div class="panel-body">
        <h1>Cadastrar saída</h1>
        <br />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Casa de sementes *">
                <form-entity-select
                  v-model="form.seeds_house"
                  type="seeds_houses"
                  :validate="'required'"
                  @selected="seedsHouseSelected"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Semente *">
                <form-entity-select
                  v-model="form.seed"
                  type="seeds"
                  :validate="'required'"
                  @selected="seedSelected"
                />
              </b-form-group>
            </div>
          </div>
          <div v-if="lot_filtered_options.length" class="row">
            <div class="col-sm-6">
              <b-form-group label="Lote *">
                <form-entity-select
                  v-model="form.lot"
                  :items="lot_filtered_options"
                  :validate="'required'"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Quantidade (Kg) *">
                <b-form-input
                  v-model="form.qtd"
                  v-validate="'required'"
                  type="number"
                  step="0.01"
                  lang="nb"
                  min="0"
                  :max="max_lot"
                  name="qtd"
                />
                <field-error :msg="veeErrors" field="qtd" />
                <small v-show="max_lot" class="text-muted"
                  >Máximo de {{ max_lot | kg }} para este lote</small
                >
                <span v-if="max_lot === 0" class="text-danger"
                  >Não existe estoque dessa semente para esta casa</span
                >
              </b-form-group>
            </div>
          </div>
          <div v-if="lot_filtered_options.length" class="row">
            <div class="col-sm-6">
              <b-form-group label="Comprador">
                <form-entity-select v-model="form.buyer" type="clients" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Modos de saída *">
                <b-form-radio-group
                  v-model="form.out_mode"
                  v-validate="'required'"
                  :options="modosDeSaida"
                  stacked
                  name="out_mode"
                />
                <field-error :msg="veeErrors" field="out_mode" />
              </b-form-group>
            </div>
          </div>
          <div v-if="lot_filtered_options.length && form.buyer" class="row">
            <div class="col-sm-6">
              <b-form-group label="Encomenda">
                <form-entity-select
                  v-model="form.order"
                  type="orders"
                  :filter="{ client: form.buyer }"
                />
              </b-form-group>
            </div>
          </div>
          <div v-if="form.seeds_house && form.seed" class="row">
            <div class="col-sm-12">
              <no-item
                :list="lot_filtered_options"
                msg="Nenhum lote encontrado para esta casa/semente"
              />
            </div>
          </div>
          <form-submit :errors="error" :sending="isSending" />
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import modosDeSaida from '@/data/modos-de-saida.json'
import NoItem from '@/components/NoItem'

export default {
  name: 'StockOutForm',
  components: {
    Breadcrumb,
    Loading,
    FormEntitySelect,
    FormSubmit,
    FieldError,
    NoItem,
  },
  data() {
    return {
      lot_filtered_options: [],
      lot_options: [],
      price: null,
      modosDeSaida,
      form: {
        price: 0,
        out_mode: null,
        qtd: 0,
        seeds_house: null,
        seed: null,
        buyer: null,
        lot: null,
        order: null,
        createdBy: this.$auth.user._id,
      },
    }
  },
  computed: {
    max_lot() {
      if (this.lots && this.form.lot) {
        const lot = this.lots.find((lot) => {
          return lot._id === this.form.lot
        })
        const stockInsTotal = lot.stock_ins.map((stockIn) => stockIn.qtd)
        const stockOutsTotal = lot.stock_outs.map((stockOut) => stockOut.qtd)
        if (stockInsTotal.length > 0) {
          if (stockOutsTotal.length > 0) {
            return (
              stockInsTotal.reduce((a, b) => a + b, 0) -
              stockOutsTotal.reduce((a, b) => a + b, 0)
            )
          } else {
            return stockInsTotal.reduce((a, b) => a + b, 0)
          }
        }
        return 0
      }
      return null
    },
  },
  created() {
    this.$axios
      .get('lots', {
        params: {
          populate: 'stock_ins stock_outs',
        },
      })
      .then((response) => {
        this.lots = response.data
      })
      .catch(this.showError)
  },
  methods: {
    save() {
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.isSending = true
          this.error = null

          if (this.form.qtd) {
            if (this.price) {
              this.form.price = this.price * this.form.qtd
            }
          }

          this.saveItem()
        }
      })
    },
    saveItem() {
      this.$axios({
        method: 'POST',
        url: 'stock_out',
        data: this.form,
      })
        .then((resp) => {
          const stockOut = resp.data
          if (stockOut && stockOut._id) {
            this.isSending = false
            this.notify('Saída cadastrada com sucesso!')
            this.$router.replace('/estoque')
          }
          this.isSending = false
        })
        .catch(this.showError)
    },
    seedSelected(seed) {
      if (seed) {
        this.price = parseFloat(seed.compensation_collect)
        this.filterOptions()
      }
    },
    seedsHouseSelected() {
      this.filterOptions()
    },
    filterOptions() {
      if (this.form.seed && this.form.seeds_house) {
        this.lot_filtered_options = this.lots
          .filter((lot) => {
            return (
              lot.seed === this.form.seed &&
              lot.seeds_house === this.form.seeds_house &&
              lot.stock_ins.length > 0
            )
          })
          .map((lot) => ({
            id: lot._id,
            title: lot.code,
          }))
        this.form.lot = null
      }
    },
  },
}
</script>
