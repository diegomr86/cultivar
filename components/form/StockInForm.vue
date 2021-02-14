<template>
  <div class="stock-in-form">
    <breadcrumb
      :links="[['Estoque', '/estoque']]"
      active="Entrada de estoque"
    />
    <div class="panel">
      <div class="panel-body">
        <h1>Cadastrar entrada</h1>
        <br />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-12">
              <b-form-group label="Casa de sementes *">
                <form-entity-select
                  v-model="form.seeds_house"
                  type="seeds_houses"
                  :validate="'required'"
                  @selected="seedsHouseSelected"
                />
              </b-form-group>
            </div>
          </div>
          <form-group-collector v-if="form.seeds_house" v-model="form" />
          <div v-if="form.seeds_house" class="row">
            <div class="col-sm-12">
              <form-stock-item v-model="form.stock_items" :form="form" />
            </div>
          </div>
          <form-submit
            v-if="
              form.seeds_house && form.stock_items && form.stock_items.length
            "
            :errors="error"
            :sending="isSending"
          />
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormGroupCollector from '@/components/FormGroupCollector'
import FormStockItem from '@/components/FormStockItem'
import FormSubmit from '@/components/FormSubmit'

export default {
  name: 'StockInForm',
  components: {
    Breadcrumb,
    Loading,
    FormEntitySelect,
    FormGroupCollector,
    FormStockItem,
    FormSubmit,
  },

  data() {
    return {
      seeds_house_code: '',
      save_completed: [],
      form: {
        seeds_house: null,
        group: '',
        collector: null,
        stock_items: [],
        createdBy: null,
      },
    }
  },
  watch: {
    'form.collector'() {
      this.form.stock_items = []
    },
    'form.group'() {
      this.form.stock_items = []
    },
    save_completed() {
      if (
        this.save_completed &&
        this.save_completed.length === this.form.stock_items.length
      ) {
        this.isSending = false
        this.notify('Entrada cadastrada com sucesso!')
        this.$router.replace('/estoque')
      }
    },
  },
  created() {
    // this.form.createdBy = this.$auth.user._id
  },
  methods: {
    edit(id) {
      this.isLoading = true
      this.$axios
        .get('stock_in/' + id)
        .then((response) => {
          const data = response.data
          this.apiDataToForm(this.form, data)
          this.isLoading = false
        })
        .catch(this.showError)
    },
    save() {
      this.$validator.validate().then(async (isValid) => {
        if (isValid) {
          this.isSending = true
          try {
            await Promise.all(
              this.form.stock_items.map(async (stockItem, i) => {
                if (!stockItem.lot && stockItem.new_lot) {
                  const lot = await this.$axios.post('lots', {
                    code: stockItem.new_lot,
                    seeds_house: this.form.seeds_house,
                    seed: stockItem.seed,
                  })
                  this.form.stock_items[i].lot = lot.data._id
                }
              })
            )
            this.saveItem()
          } catch (e) {
            this.showError(e)
          }
        }
      })
    },
    saveItem() {
      const stockIns = this.form.stock_items.map((item) => {
        item.seeds_house = this.form.seeds_house
        item.group = this.form.group
        item.collector = this.form.collector
        return item
      })
      stockIns.forEach((stockIn) => {
        this.$axios({
          method: 'POST',
          url: 'stock_in',
          data: stockIn,
        })
          .then((resp) => {
            const stockIn = resp.data
            if (stockIn && stockIn._id) {
              this.save_completed.push(stockIn)
            }
          })
          .catch(this.showError)
      })
    },
    seedsHouseSelected(seedsHouse) {
      if (seedsHouse) {
        this.seeds_house_code = seedsHouse.description
      } else {
        this.seeds_house_code = null
      }
    },
  },
}
</script>
