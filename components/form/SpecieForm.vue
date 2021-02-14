<template>
  <div class="specie-form">
    <breadcrumb
      :links="[['Espécies', '/especies']]"
      :active="isEditing() ? form.scientific_name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="espécie" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-md-12">
              <b-form-group label="Nome científico *">
                <b-form-input
                  v-model="form.scientific_name"
                  v-validate="'required'"
                  name="scientific_name"
                />
                <field-error :msg="veeErrors" field="scientific_name" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <b-form-group
                label="Nomes populares"
                description="Escreva todos os nome regionais que essa espécie possuí separados por virgula"
              >
                <b-form-input
                  v-model="form.local_name"
                  v-validate="'required'"
                  name="local_name"
                />
                <field-error :msg="veeErrors" field="scientific_name" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <b-form-group
                label="Descrição da espécie"
                description="Beneficiamento de sementes - Dicas e cuidados importantes"
              >
                <b-form-textarea
                  v-model="form.description"
                  :rows="3"
                ></b-form-textarea>
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-md-6">
              <b-form-group label="Família">
                <b-form-input v-model="form.family" name="family" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Biomas">
                <b-form-checkbox-group
                  v-model="form.biomes"
                  :options="biomas"
                  name="biomes"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-12">
              <b-form-group
                label="Tipos de vegetação"
                description="Escreva tipos de vegetação separados por virgula"
              >
                <b-form-input
                  v-model="form.vegetation_types"
                  name="vegetation_types"
                />
              </b-form-group>
            </div>
            <div class="col-sm-12">
              <b-form-group label="Presença nos estados">
                <b-form-checkbox-group
                  v-model="form.presence"
                  :options="estados"
                  name="presence"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Hábitos">
                <b-form-select
                  v-model="form.habit"
                  :options="habitos"
                  name="habit"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Origem">
                <b-form-select
                  v-model="form.origin"
                  :options="origens"
                  name="origin"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Estratégia de ocupação">
                <b-form-select
                  v-model="form.occupation_strategy"
                  :options="estrategiasDeOcupacao"
                  name="occupation_strategy"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Ciclo de vida">
                <b-form-input v-model="form.cycle" name="cycle" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <b-form-group
                label="Taxa de viabilidade *"
                description="Classe de % de estabelecimento em campo"
              >
                <form-viability-rate v-model="form.viability_rate" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group
                label="Qtd. de sementes / Kg *"
                :description="
                  form.seeds_kg > 0 ? form.seeds_kg + ' sementes por quilo' : ''
                "
              >
                <b-form-input v-model="form.seeds_kg" type="number" min="0" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group
                label="Limite de peso por lote (Kg)"
                :description="
                  form.lot_limit > 0
                    ? 'Limite de ' + form.lot_limit + ' quilos por lote'
                    : ''
                "
              >
                <b-form-input
                  v-model="form.lot_limit"
                  type="number"
                  step="0.01"
                  lang="nb"
                  min="0"
                />
              </b-form-group>
            </div>
            <div class="col-sm-12">
              <b-form-group label="Conservação de sementes">
                <form-seed-conservations v-model="form.seed_conservations" />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-12">
              <b-form-group>
                <b-form-checkbox
                  v-model="form.mapa_standard_established"
                  switch
                >
                  Tem padrão de qualidade estabelecido pelo MAPA?
                </b-form-checkbox>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <pictures-upload
                v-model="form.images"
                :preview="images_preview"
                :error="error"
                url="uploads/images"
                :multiple="true"
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
import FormSubmit from '@/components/FormSubmit'
import FormViabilityRate from '@/components/FormViabilityRate'
import FormSeedConservations from '@/components/FormSeedConservations'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import meses from '@/data/meses.json'
import fitofisionomias from '@/data/fitofisionomias.json'
import estados from '@/data/estados.json'
import habitos from '@/data/habitos.json'
import origens from '@/data/origens.json'
import estrategiasDeOcupacao from '@/data/estrategias-de-ocupacao.json'
import biomas from '@/data/biomas.json'

export default {
  name: 'SpecieForm',

  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormSubmit,
    FormViabilityRate,
    FormSeedConservations,
    FieldError,
    PicturesUpload,
  },

  data() {
    return {
      meses,
      fitofisionomias,
      estados: estados.filter((estado) => estado.value),
      habitos,
      origens,
      biomas,
      estrategiasDeOcupacao,
      form: {
        scientific_name: '',
        local_name: '',
        description: '',
        family: '',
        biomes: [],
        vegetation_types: '',
        presence: [],
        habit: '',
        origin: '',
        cycle: '',
        occupation_strategy: '',
        viability_rate: {},
        seed_conservations: [],
        seeds_kg: 0,
        lot_limit: 0,
        images: [],
        mapa_standard_established: false,
      },
      images_preview: [],
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
        .get('species/' + id)
        .then((response) => {
          const data = response.data
          data.local_name = data.local_name.join(', ')
          data.vegetation_types = data.vegetation_types.join(', ')
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
          this.error = null
          if (this.form.local_name) {
            this.form.local_name = this.form.local_name.split(', ')
          }
          if (this.form.vegetation_types) {
            this.form.vegetation_types = this.form.vegetation_types.split(', ')
          }

          this.$axios({
            method: this.isEditing() ? 'PUT' : 'POST',
            url: this.isEditing()
              ? 'species/' + this.$route.params.id
              : 'species',
            data: this.form,
          })
            .then((resp) => {
              const specie = resp.data
              if (specie && specie._id) {
                this.$router.replace('/especies/' + specie.slug)
              } else {
                this.error = specie
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
