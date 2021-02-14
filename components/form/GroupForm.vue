<template>
  <div class="group-form">
    <breadcrumb
      :links="[['Grupos de coletores', '/grupos']]"
      :active="isEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="grupo de coletores" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Nome do grupo *">
                <b-form-input
                  v-model="form.name"
                  v-validate="'required'"
                  name="name"
                />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="CNPJ">
                <the-mask v-model="form.cnpj" :mask="['##.###.###/####-##']" />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group
                label="Contatos *"
                description="Liste todas as formas de contato com o grupo"
              >
                <b-form-textarea
                  v-model="form.contact"
                  v-validate="'required'"
                  name="contact"
                  :rows="3"
                />
                <field-error :msg="veeErrors" field="contact" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group
                label="Descrição do grupo"
                description="Descreva aqui um pouco do trabalho do grupo de coletores"
              >
                <b-form-textarea
                  v-model="form.description"
                  :rows="3"
                  name="body"
                />
              </b-form-group>
            </div>
          </div>
          <form-address v-model="form.address" />
          <form-bank-account v-model="form.bank_account" />
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Sementes">
                <form-entities-select v-model="form.seeds" type="seeds" />
              </b-form-group>
            </div>
            <!-- <div class="col-sm-6">
            <b-form-group label="Coletores">
              <form-entities-select v-if="collectors && collectors.length" :items="collectors" type="collectors" v-model="form.collectors" />
              <no-item :list="collectors" />
            </b-form-group>
          </div> -->
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
// import NoItem from '@/components/NoItem'
import FormHeadline from '@/components/FormHeadline'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import bancos from '@/data/bancos.json'
import tiposDeConta from '@/data/tipos-de-conta2.json'

export default {
  name: 'GroupForm',
  components: {
    Breadcrumb,
    Loading,
    // NoItem,
    FormHeadline,
    FormEntitiesSelect,
    FormAddress,
    FormBankAccount,
    FormSubmit,
    FieldError,
  },
  data() {
    return {
      bancos: bancos.map((banco) => ({
        value: Number(banco.value),
        text: banco.text,
      })),
      tiposDeConta,
      // collectors: [],
      form: {
        name: '',
        description: '',
        cnpj: '',
        contact: '',
        address: {
          uf: '',
          city: '',
          postal_code: '',
          address: '',
        },
        bank_account: {
          bank_number: '',
          agency: '',
          account: '',
          type: 'corrente',
        },
        seeds: [],
      },
    }
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    }
  },
  methods: {
    edit(id) {
      this.isLoading = true
      this.$axios
        .$get('groups/' + id)
        .then((response) => {
          this.apiDataToForm(this.form, response)
          this.isLoading = false
        })
        .catch(this.showError)
    },
    save() {
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.isSending = true
          this.error = null

          this.$axios({
            method: this.isEditing() ? 'PUT' : 'POST',
            url:
              'groups' + (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form,
          })
            .then((resp) => {
              const group = resp.data
              if (group && group._id) {
                this.$router.replace('/grupos/' + group._id)
              }
              this.isSending = false
            })
            .catch(this.showError)
        }
      })
    },
  },
}
</script>
