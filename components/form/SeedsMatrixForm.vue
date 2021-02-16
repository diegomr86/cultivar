<template>
  <div class="seeds-matrix-form">
    <breadcrumb
      :links="[['Matrizes de semente', '/matrizes-de-sementes']]"
      :active="formEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="matriz de sementes" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Nome da matriz *">
                <b-form-input
                  v-model="form.name"
                  v-validate="'required'"
                  name="name"
                  @input="generateCode"
                />
                <field-error :msg="veeErrors" field="name" />
                <small v-if="form.code">Código: {{ form.code }}</small>
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Nome científico">
                <b-form-input v-model="form.scientific_name" />
              </b-form-group>
            </div>
          </div>
          <form-group-collector v-model="form" />
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
          </div>
          <div class="row">
            <div class="col-sm-12">
              <b-form-group label="Áreas de coleta">
                <form-entity-select
                  v-model="form.collection_area"
                  :items="collection_areas"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <b-form-group label="Categoria *">
                <b-form-radio-group
                  v-model="form.category"
                  v-validate="'required'"
                  :options="categoriasDeMatrizes"
                  stacked
                  name="category"
                />
                <field-error :msg="veeErrors" field="category" />
              </b-form-group>
            </div>
            <div class="col-sm-4">
              <b-form-group label="Origem *">
                <b-form-radio-group
                  v-model="form.source"
                  v-validate="'required'"
                  :options="origensDeMatrizes"
                  stacked
                  name="source"
                />
                <field-error :msg="veeErrors" field="source" />
              </b-form-group>
            </div>
            <div class="col-sm-4">
              <b-form-group label="Meses prováveis de coleta">
                <b-form-checkbox-group
                  v-model="form.collec_months"
                  :options="meses"
                  stacked
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <documents-upload
                v-model="form.documents"
                multiple
                :error="error"
                url="uploads/documents"
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
import FormHeadline from '@/components/FormHeadline'
import FormGroupCollector from '@/components/FormGroupCollector'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import DocumentsUpload from '@/components/DocumentsUpload'
import categoriasDeMatrizes from '@/data/categorias-de-matrizes.json'
import origensDeMatrizes from '@/data/origens-de-matrizes.json'
import meses from '@/data/meses.json'
import utils from '@/components/utils'

export default {
  name: 'SeedsMatrixForm',
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormGroupCollector,
    FormEntitySelect,
    FormSubmit,
    FieldError,
    DocumentsUpload,
  },
  data() {
    return {
      categoriasDeMatrizes,
      origensDeMatrizes,
      collection_areas: [],
      meses,
      form: {
        code: '',
        name: '',
        scientific_name: '',
        category: '',
        source: '',
        collec_months: [],
        geolocation: {
          lat: '',
          lng: '',
        },
        group: null,
        collector: null,
        collection_area: null,
        documents: [],
      },
    }
  },
  async created() {
    this.collection_areas = (await this.loadList('collection_areas'))
      .map((collectionArea) => ({
        id: collectionArea._id,
        title: collectionArea.name,
        description: this.formatCity(collectionArea.address),
      }))
      .sort(function (a, b) {
        return a.title.localeCompare(b.title)
      })

    if (this.formEditing()) {
      this.edit(this.$route.params.id)
    }
  },
  methods: {
    edit(id) {
      this.isLoading = true
      this.$axios
        .get('seeds_matrixes/' + id)
        .then((response) => {
          this.apiDataToForm(this.form, response.data)
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
              'seeds_matrixes' +
              (this.formEditing() ? '/' + this.$route.params.id : ''),
            data: this.form,
          })
            .then((resp) => {
              const seedsMatrix = resp.data
              if (seedsMatrix && seedsMatrix._id) {
                this.$router.replace('/matrizes-de-sementes/' + seedsMatrix._id)
              }
              this.isSending = false
            })
            .catch(this.showError)
        }
      })
    },
    generateCode() {
      if (!this.$route.params.id || !this.form.code) {
        this.form.code = utils.generateCode(this.form.name.split(' '))
      }
    },
  },
}
</script>
