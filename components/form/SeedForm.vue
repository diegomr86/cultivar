<template>
  <div class="seed-form">
    <breadcrumb
      :links="[['Sementes', '/sementes']]"
      :active="formEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="semente" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-12">
              <b-form-group label="Selecione a espécie">
                <form-entity-select
                  v-model="form.specie"
                  type="species"
                  @selected="specieSelected"
                />
              </b-form-group>
            </div>
          </div>
          <div v-if="formEditing() || form.specie" class="row">
            <div class="col-sm-12">
              <b-form-group label="Nome da semente *">
                <b-form-input
                  v-model="form.name"
                  v-validate="'required'"
                  name="name"
                />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-md-12">
              <b-form-group label="Descrição da semente">
                <b-form-textarea
                  v-model="form.description"
                  :rows="3"
                ></b-form-textarea>
              </b-form-group>
            </div>
          </div>
          <div v-if="formEditing() || form.specie" class="row gray">
            <div class="col-md-3 col-sm-6">
              <b-form-group label="Preço *">
                <money v-model="form.price"></money>
              </b-form-group>
            </div>
            <div class="col-md-3 col-sm-6">
              <b-form-group label="Preço no atacado *">
                <money v-model="form.wholesale_price"></money>
              </b-form-group>
            </div>
            <div class="col-md-3 col-sm-6">
              <b-form-group label="Remuneração do coletor *">
                <money v-model="form.compensation_collect"></money>
              </b-form-group>
            </div>
            <div class="col-md-3 col-sm-6">
              <b-form-group label="Qtd. em estoque (Kg)">
                <b-form-input
                  v-model="form.stock"
                  type="number"
                  step="0.01"
                  lang="nb"
                  min="0"
                  disabled="disabled"
                />
              </b-form-group>
            </div>
          </div>
          <div v-if="formEditing() || form.specie" class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Época da frutificação">
                <b-form-checkbox-group
                  v-model="form.fruiting_season"
                  :options="meses"
                  name="fruiting_season"
                />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <pictures-upload
                v-model="form.images"
                :preview="images_preview"
                :error="error"
                url="uploads/images"
                :multiple="true"
              />
            </div>
          </div>
          <form-submit
            v-if="formEditing() || form.specie"
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
import FormHeadline from '@/components/FormHeadline'
import FormSubmit from '@/components/FormSubmit'
import FormEntitySelect from '@/components/FormEntitySelect'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import meses from '@/data/meses.json'

export default {
  name: 'SeedForm',
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormSubmit,
    FieldError,
    PicturesUpload,
    FormEntitySelect,
  },
  props: {
    specie: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      meses,
      form: {
        specie: null,
        name: '',
        scientific_name: '',
        description: '',
        compensation_collect: 0,
        price: 0,
        wholesale_price: 0,
        stock: 0,
        fruiting_season: [],
        images: [],
      },
      images_preview: [],
    }
  },

  created() {
    if (this.formEditing()) {
      this.edit(this.$route.params.id)
    }

    if (this.specie) {
      this.form.specie = this.specie._id
    }
  },

  methods: {
    edit(id) {
      this.isLoading = true
      this.$axios
        .get('seeds/' + id)
        .then((response) => {
          const data = response.data
          this.apiDataToForm(this.form, data)
          Object.assign(this.images_preview, data.images)
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
              ? 'seeds/' + this.$route.params.id
              : 'seeds',
            data: this.form,
          })
            .then((resp) => {
              const seed = resp.data
              if (seed && seed._id) {
                if (this.specie) {
                  this.$emit('created', seed)
                } else {
                  this.$router.replace('/sementes/' + seed._id)
                }
                if (this.formEditing()) {
                  this.notify('Semente atualizada com sucesso')
                } else {
                  this.notify('Semente cadastrada com sucesso')
                }
              } else {
                this.currentError = seed
              }
              this.isSending = false
            })
            .catch(this.showError)
        }
      })
    },
    specieSelected(specie) {
      if (specie.description) {
        this.form.name = specie.description.split(', ')[0]
      }
      this.form.scientific_name = specie.title
      this.form.images = specie.images
    },
  },
}
</script>
