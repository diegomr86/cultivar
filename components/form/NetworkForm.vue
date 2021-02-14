<template>
  <div class="group-form">
    <breadcrumb
      :links="[['Redes', '/redes']]"
      :active="isEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="rede" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-12">
              <b-form-group label="Nome da rede *">
                <b-form-input
                  v-model="form.name"
                  v-validate="'required'"
                  name="name"
                />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="CNPJ">
                <the-mask v-model="form.cnpj" :mask="['##.###.###/####-##']" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="RENASEM">
                <b-form-input v-model="form.renasem" name="renasem" />
                <field-error :msg="veeErrors" field="renasem" />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group
                label="Contato *"
                description="Liste todas as formas de contato com a rede"
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
                label="Descrição da rede"
                description="Descreva aqui um pouco do trabalho da rede"
              >
                <b-form-textarea
                  v-model="form.description"
                  :rows="3"
                  name="body"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group
                label="Domínio *"
                description="Exemplo: xingu.sementesdoxingu.org.br"
              >
                <b-form-input
                  v-model="form.domain_name"
                  v-validate="'required'"
                  name="domain_name"
                />
                <field-error :msg="veeErrors" field="domain_name" />
              </b-form-group>
            </div>
            <div class="col-md-6">
              <pictures-upload
                v-model="form.image"
                label="Logomarca"
                :preview="images_preview"
                :error="error"
                url="uploads/images"
              />
            </div>
          </div>
          <form-address v-model="form.address" :gray="true" />
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Nome do responsável técnico">
                <b-form-input
                  v-model="form.responsible_technician.name"
                  name="responsible_technician_name"
                />
                <field-error
                  :msg="veeErrors"
                  field="responsible_technician_name"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="CNPJ do responsável técnico">
                <the-mask
                  v-model="form.responsible_technician.cnpj"
                  :mask="['##.###.###/####-##']"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="CREA do responsável técnico">
                <b-form-input
                  v-model="form.responsible_technician.crea"
                  name="responsible_technician_crea"
                />
                <field-error
                  :msg="veeErrors"
                  field="responsible_technician_crea"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="RENASEM do responsável técnico">
                <b-form-input
                  v-model="form.responsible_technician.renasem"
                  name="responsible_technician_renasem"
                />
                <field-error
                  :msg="veeErrors"
                  field="responsible_technician_renasem"
                />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Telefone do responsável técnico">
                <b-form-input
                  v-model="form.responsible_technician.contact"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  name="responsible_technician_contact"
                />
                <field-error
                  :msg="veeErrors"
                  field="responsible_technician_contact"
                />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Email do responsável técnico">
                <b-form-input
                  v-model="form.responsible_technician.email"
                  v-validate="'email'"
                  name="responsible_technician_email"
                />
                <field-error
                  :msg="veeErrors"
                  field="responsible_technician_email"
                />
              </b-form-group>
            </div>
          </div>
          <form-address
            v-model="form.responsible_technician.address"
            :optional="true"
            complement-text="do responsável técnico"
          />
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
import FormAddress from '@/components/FormAddress'
import FormSubmit from '@/components/FormSubmit'
import FieldError from '@/components/FieldError'
import PicturesUpload from '@/components/PicturesUpload'

export default {
  name: 'GroupForm',
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormAddress,
    FormSubmit,
    FieldError,
    PicturesUpload,
  },
  data() {
    return {
      images_preview: [],
      collectors: [],
      form: {
        name: '',
        domain_name: '',
        image: {},
        description: '',
        cnpj: '',
        renasem: '',
        contact: '',
        address: {
          uf: '',
          city: '',
          postal_code: '',
          address: '',
        },
        responsible_technician: {
          name: '',
          cnpj: '',
          crea: '',
          renasem: '',
          contact: '',
          email: '',
          address: {
            uf: '',
            city: '',
            postal_code: '',
            address: '',
          },
        },
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
        .$get('networks/' + id)
        .then((network) => {
          this.apiDataToForm(this.form, network)
          if (network.image) {
            this.images_preview = [network.image]
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

          this.$axios({
            method: this.isEditing() ? 'PUT' : 'POST',
            url:
              'networks' +
              (this.isEditing() ? '/' + this.$route.params.id : ''),
            data: this.form,
          })
            .then((resp) => {
              const network = resp.data
              if (network && network._id) {
                this.$router.replace('/redes/' + network._id)
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
