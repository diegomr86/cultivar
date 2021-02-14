<template>
  <div class="form-bank-account">
    <div class="row" :class="{ gray: gray }">
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Banco">
          <b-form-select
            v-model="bank_account.bank_number"
            class="form-control"
            :options="bancos"
            @input="changed"
          />
        </b-form-group>
      </div>
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Agência">
          <b-form-input v-model="bank_account.agency" @input="changed" />
        </b-form-group>
      </div>
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Conta">
          <b-form-input v-model="bank_account.account" @input="changed" />
        </b-form-group>
      </div>
      <div class="col-md-3 col-sm-6">
        <b-form-group label="Tipo de conta">
          <b-form-radio-group
            v-model="bank_account.type"
            :options="tiposDeConta"
            stacked
            @input="changed"
          >
          </b-form-radio-group>
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import bancos from '@/data/bancos.json'
import tiposDeConta from '@/data/tipos-de-conta.json'

export default {
  name: 'FormBankAccount',
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
  },
  data() {
    return {
      bancos,
      tiposDeConta,
      bank_account: {
        bank_number: '',
        agency: '',
        account: '',
        type: '',
      },
    }
  },
  created() {
    this.bank_account = this.value
  },
  methods: {
    changed() {
      this.$emit('input', this.bank_account)
    },
  },
}
</script>
