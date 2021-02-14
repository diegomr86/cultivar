<template>
  <div v-if="bankAccount" class="bank-account">
    <dl v-if="bankAccount.bank_number">
      <dt>Banco</dt>
      <dd>
        {{
          bancos.find((banco) => banco.value === bankAccount.bank_number).text
        }}
      </dd>
    </dl>
    <dl v-if="bankAccount.agency">
      <dt>Agência</dt>
      <dd>{{ bankAccount.agency }}</dd>
    </dl>
    <dl v-if="bankAccount.account">
      <dt>Conta {{ accountType }}</dt>
      <dd>{{ bankAccount.account }}</dd>
    </dl>
  </div>
</template>
<script>
import bancos from '@/data/bancos.json'
import tiposDeConta from '@/data/tipos-de-conta.json'

export default {
  name: 'BankAccount',
  props: {
    bankAccount: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      bancos,
      tiposDeConta,
    }
  },
  computed: {
    accountType() {
      if (this.bankAccount.type) {
        return tiposDeConta.find((tipoDeConta) => {
          return tipoDeConta.value === this.bankAccount.type
        }).text
      }
      return ''
    },
  },
}
</script>
