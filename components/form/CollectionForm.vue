<template>
  <div class="collection-form">
    <breadcrumb
      :links="[['Coletas de sementes', '/coletas']]"
      :active="formEditing() ? 'Coleta ' : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="coleta" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Data e hora da coleta *" class="date_time">
                <b-form-datepicker
                  v-model="date_time.date"
                  v-validate="'required'"
                  class="date"
                  name="date_time"
                  locale="pt-BR"
                  :date-format-options="{
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }"
                  placeholder="DD/MM/AAAA"
                />
                <b-form-input
                  v-model="date_time.time"
                  v-mask="['##:##']"
                  class="time"
                  placeholder="00:00"
                  type="text"
                />
                <field-error :msg="veeErrors" field="date_time" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Semente">
                <form-entity-select
                  v-model="form.seed"
                  type="seeds"
                  :validate="'required'"
                />
              </b-form-group>
            </div>
          </div>
          <form-group-collector v-if="isManagerOrAbove" v-model="form" />
          <div class="row gray">
            <div class="col-sm-4">
              <b-form-group label="Peso bruto (Kg)">
                <b-form-input
                  v-model="form.weight_gross"
                  type="number"
                  step="0.01"
                  lang="nb"
                  min="0"
                />
              </b-form-group>
            </div>
            <div class="col-sm-4">
              <b-form-group label="Peso beneficiado (Kg)">
                <b-form-input
                  v-model="form.weight_benef"
                  type="number"
                  step="0.01"
                  lang="nb"
                  min="0"
                />
              </b-form-group>
            </div>
            <div class="col-sm-4">
              <b-form-group label="Período de florescimento">
                <b-form-datepicker
                  v-model="form.flowering"
                  locale="pt-BR"
                  :date-format-options="{
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }"
                  placeholder="DD/MM/AAAA"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <pictures-upload
                v-model="form.images"
                :error="error"
                url="uploads/images"
                :multiple="true"
              />
            </div>
            <div class="col-sm-6">
              <audios-upload
                v-model="form.audio"
                :error="error"
                url="uploads/audios"
              />
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group
                label="Comentários"
                description="Insira aqui os comentários sobre esta coleta"
              >
                <b-form-textarea v-model="form.commentary" :rows="3" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Latitude">
                <b-form-input v-model="form.geolocation.lat" />
              </b-form-group>
              <b-form-group label="Longitude">
                <b-form-input v-model="form.geolocation.lng" />
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
import FormGroupCollector from '@/components/FormGroupCollector'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import AudiosUpload from '@/components/AudiosUpload'
import PicturesUpload from '@/components/PicturesUpload'

export default {
  name: 'CollectionForm',

  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormGroupCollector,
    FormSubmit,
    FieldError,
    AudiosUpload,
    PicturesUpload,
  },
  data() {
    return {
      date_time: { date: '', time: '' },
      form: {
        date_time: '',
        weight_gross: '',
        weight_benef: '',
        flowering: '',
        collector: null,
        group: null,
        seed: null,
        images: [],
        audio: null,
        commentary: '',
        geolocation: {
          lat: '',
          lng: '',
        },
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
        .$get('collections/' + id)
        .then((response) => {
          this.apiDataToForm(this.form, response)

          if (this.form.date_time) {
            const dt = this.form.date_time.split('T')
            this.date_time.date = dt[0]
            this.date_time.time = dt[1]
          }
          this.isLoading = false
        })
        .catch(this.showError)
    },
    save() {
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.isSending = true
          this.error = null
          if (this.date_time.date && this.date_time.time) {
            this.form.date_time =
              this.date_time.date + 'T' + this.date_time.time + ':00'
          }
          this.$axios({
            method: this.formEditing() ? 'PUT' : 'POST',
            url:
              'collections' +
              (this.formEditing() ? '/' + this.$route.params.id : ''),
            data: this.form,
          })
            .then((resp) => {
              const collection = resp.data
              if (collection && collection._id) {
                this.$router.replace('/coletas/' + collection._id)
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
