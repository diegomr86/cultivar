<template>
  <div class="seeds-house-form">
    <breadcrumb
      :links="[['Casas de sementes', '/casas-de-sementes']]"
      :active="formEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="casa de sementes" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-8">
              <b-form-group label="Nome da casa *">
                <b-form-input
                  v-model="form.name"
                  v-validate="'required'"
                  name="name"
                />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-sm-4">
              <b-form-group
                label="Código da casa *"
                description="Este código será usado na geração do lote."
              >
                <b-form-input
                  v-model="form.code"
                  v-validate="'required'"
                  name="code"
                />
                <field-error :msg="veeErrors" field="code" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Telefone">
                <b-form-input
                  v-model="form.phone"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Proprietário">
                <form-entity-select v-model="form.owner" type="users" />
              </b-form-group>
            </div>
          </div>
          <form-address v-model="form.address" />
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Coletores">
                <form-entities-select
                  v-model="form.collectors"
                  type="collectors"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Grupos de coletores">
                <form-entities-select v-model="form.groups" type="groups" />
              </b-form-group>
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
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormEntitiesSelect from '@/components/FormEntitiesSelect'
import FormAddress from '@/components/FormAddress'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'

export default {
  name: 'SeedsHouseForm',

  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormEntitiesSelect,
    FormAddress,
    FormSubmit,
    FieldError,
  },

  data() {
    return {
      user_options: [],
      group_options: [],
      collector_options: [],
      form: {
        name: '',
        code: '',
        email: '',
        phone: '',
        groups: [],
        collectors: [],
        address: {
          uf: '',
          city: '',
          postal_code: '',
          address: '',
        },
        owner: null,
      },
    }
  },

  created() {
    if (this.formEditing()) {
      this.edit(this.$route.params.id)
    }
  },

  methods: {
    edit(id) {
      this.isLoading = true
      this.$axios
        .get('seeds_houses/' + id)
        .then((response) => {
          const data = response.data
          this.apiDataToForm(this.form, data)
          this.isLoading = false
        })
        .catch(this.showError)
    },
    save() {
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.isSending = true
          this.currentError = null

          this.$axios({
            method: this.formEditing() ? 'PUT' : 'POST',
            url: this.formEditing()
              ? 'seeds_houses/' + this.$route.params.id
              : 'seeds_houses',
            data: this.form,
          })
            .then((resp) => {
              const seedsHouse = resp.data
              if (seedsHouse && seedsHouse._id) {
                this.$router.replace('/casas-de-sementes/' + seedsHouse._id)
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
