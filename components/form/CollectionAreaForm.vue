<template>
  <div class="collection-area-form">
    <breadcrumb
      :links="[['Áreas de coleta', '/areas-de-coleta']]"
      :active="formEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="área de coleta" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-8">
              <b-form-group label="Nome da área *">
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
                label="Área estimada"
                :description="'Área de ' + form.estimated_area + ' hectares'"
              >
                <b-form-input
                  v-model="form.estimated_area"
                  type="number"
                  step="0.01"
                  lang="nb"
                  min="0"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group
                label="Descrição da área"
                description="Descreva aqui as características da área"
              >
                <b-form-textarea v-model="form.description" :rows="3" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <documents-upload
                v-model="form.documents"
                :error="error"
                multiple
                url="uploads/documents"
              />
            </div>
          </div>
          <form-address v-model="form.address" />
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Latitude">
                <b-form-input v-model="form.geolocation.lat" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Longitude">
                <b-form-input v-model="form.geolocation.lng" />
              </b-form-group>
            </div>
            <div class="col-sm-12">
              <b-form-group label="Fitofisionomias">
                <b-form-checkbox-group
                  v-model="form.vegetations"
                  :options="fitofisionomias"
                />
              </b-form-group>
            </div>
          </div>
          <form-group-collector v-model="form" />
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
import FormGroupCollector from '@/components/FormGroupCollector'
import FormAddress from '@/components/FormAddress'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import DocumentsUpload from '@/components/DocumentsUpload'
import fitofisionomias from '@/data/fitofisionomias.json'

export default {
  name: 'CollectionAreaForm',
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormGroupCollector,
    FormAddress,
    FormSubmit,
    FieldError,
    DocumentsUpload,
  },

  data() {
    return {
      fitofisionomias,
      form: {
        name: '',
        description: '',
        estimated_area: 0,
        address: {
          uf: '',
          city: '',
          postal_code: '',
          address: '',
        },
        geolocation: {
          lat: '',
          lng: '',
        },
        vegetations: [],
        group: null,
        collector: null,
        documents: [],
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
        .$get('collection_areas/' + id)
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
          this.currentError = null
          this.$axios({
            method: this.formEditing() ? 'PUT' : 'POST',
            url:
              'collection_areas' +
              (this.formEditing() ? '/' + this.$route.params.id : ''),
            data: this.form,
          })
            .then((resp) => {
              const collectionArea = resp.data
              if (collectionArea && collectionArea._id) {
                this.$router.replace('/areas-de-coleta/' + collectionArea._id)
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
