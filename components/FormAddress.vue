<template>
  <div class="form-address">
    <div class="row" :class="{ gray: gray }">
      <div class="col-sm-6">
        <b-form-group :label="stateText">
          <b-form-select
            v-model="address.uf"
            v-validate="{ required: isNotOptional }"
            class="form-control"
            :options="estados"
            name="uf"
            @input="
              loadCities()
              changed()
            "
          />
          <field-error :msg="veeErrors" field="uf" />
        </b-form-group>
      </div>
      <div class="col-sm-6">
        <b-form-group :label="cityText">
          <b-form-select
            v-model="address.city"
            class="form-control"
            :options="cidades"
            @input="changed"
          />
        </b-form-group>
      </div>
    </div>
    <div class="row" :class="{ gray: !gray }">
      <div class="col-sm-8">
        <b-form-group :label="addressText">
          <b-form-input
            v-model="address.address"
            v-validate="{ required: isNotOptional }"
            name="address"
            @input="changed"
          />
          <field-error :msg="veeErrors" field="address" />
        </b-form-group>
      </div>
      <div class="col-sm-4">
        <b-form-group :label="cepText">
          <b-form-input
            v-model="address.postal_code"
            v-mask="['#####-###']"
            @input="changed"
          />
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import estados from '@/data/estados.json'
import cidades from '@/data/cidades.json'

import FieldError from '@/components/FieldError'

export default {
  name: 'FormAddress',
  components: {
    'field-error': FieldError,
  },
  inject: ['$validator'],
  props: {
    value: {
      type: Object,
      default: () => null,
    },
    gray: {
      type: Boolean,
      default: false,
    },
    complementText: {
      type: String,
      default: null,
    },
    optional: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      estados,
      cidades: [{ value: '', text: 'Selecione o estado' }],
      address: {
        uf: '',
        city: '',
        postal_code: '',
        address: '',
      },
    }
  },
  computed: {
    cepText() {
      return 'CEP' + (this.complementText ? ' ' + this.complementText : '')
    },
    addressText() {
      return (
        'Endereço' +
        (this.complementText ? ' ' + this.complementText : '') +
        (this.optional ? '' : ' *')
      )
    },
    cityText() {
      return 'Cidade' + (this.complementText ? ' ' + this.complementText : '')
    },
    stateText() {
      return (
        'Estado' +
        (this.complementText ? ' ' + this.complementText : '') +
        (this.optional ? '' : ' *')
      )
    },
    isNotOptional() {
      return !this.optional
    },
  },
  created() {
    this.address = this.value
    this.loadCities()
  },
  methods: {
    changed() {
      this.$emit('input', this.address)
    },
    loadCities() {
      this.cidades = [{ value: '', text: 'Selecione a cidade' }].concat(
        Object(cidades)[this.address.uf]
      )
      if (this.address.city && this.cidades) {
        if (!this.cidades.find((c) => c === this.address.city)) {
          this.address.city = ''
        }
      }
    },
  },
}
</script>
