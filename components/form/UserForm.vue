<template>
  <div class="user-form">
    <breadcrumb
      :links="[
        [currentRoleText, '/usuarios?role=' + ($route.query.role || '')],
      ]"
      :active="isEditing() ? form.name : 'Cadastrar'"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline :name="roleText($route.query.role).toLowerCase()" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div v-if="isAdminOrAbove && !$route.query.role" class="row">
            <div class="col-sm-6">
              <b-form-group label="Perfil de usuário *">
                <b-form-radio-group
                  v-model="form.role"
                  v-validate="'required'"
                  :options="tiposDeUsuario"
                  name="role"
                />
                <field-error :msg="veeErrors" field="role" />
              </b-form-group>
            </div>
            <div v-if="isSuper" class="col-sm-6">
              <b-form-group label="Rede">
                <form-entity-select v-model="form.network" type="networks" />
              </b-form-group>
            </div>
          </div>
          <div v-if="form.role === 'collector'" class="row">
            <div class="col-sm-12">
              <b-form-group label="Grupo de coletores">
                <v-select
                  v-model="form.group"
                  v-validate="'required'"
                  :options="groups"
                  label="name"
                  name="group"
                  :reduce="(item) => item._id"
                />
                <field-error :msg="veeErrors" field="group" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Nome *">
                <b-form-input
                  v-model="form.name"
                  v-validate="'required'"
                  name="name"
                />
                <field-error :msg="veeErrors" field="name" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Apelido *">
                <b-form-input
                  v-model="form.nickname"
                  v-validate="'required'"
                  name="nickname"
                />
                <field-error :msg="veeErrors" field="nickname" />
              </b-form-group>
            </div>
          </div>
          <div class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Telefone *">
                <b-form-input
                  v-model="form.contact"
                  v-validate="'required'"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  name="contact"
                />
                <field-error :msg="veeErrors" field="contact" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="CPF">
                <the-mask v-model="form.cpf" :mask="['###.###.###-##']" />
              </b-form-group>
            </div>
          </div>
          <form-address v-model="form.address" :gray="true" />
          <form-bank-account v-model="form.bank_account" :gray="true" />
          <div class="row">
            <div class="col-sm-6">
              <b-form-group
                label="Nome de usuário *"
                description="Nome que será usado para acessar o sistema"
              >
                <b-form-input
                  v-model="form.username"
                  v-validate="'required'"
                  name="username"
                />
                <field-error :msg="veeErrors" field="username" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Email">
                <b-form-input
                  v-model="form.email"
                  v-validate="'email'"
                  name="email"
                />
                <field-error :msg="veeErrors" field="email" />
                <div v-if="isEditing()" class="text-right">
                  <a class="pointer" @click="changePassword">Alterar senha</a>
                </div>
              </b-form-group>
            </div>
          </div>
          <div v-if="showPasswordFields" class="row gray">
            <div class="col-sm-6">
              <b-form-group label="Senha *">
                <b-form-input
                  v-model="form.password"
                  v-validate="'required'"
                  type="password"
                  name="pass"
                />
                <field-error :msg="veeErrors" field="pass" />
              </b-form-group>
            </div>
            <div class="col-sm-6">
              <b-form-group label="Confirmar senha *">
                <b-form-input
                  v-model="form.password_confirmation"
                  v-validate="'required'"
                  type="password"
                  name="pass_confirmation"
                />
                <field-error :msg="veeErrors" field="pass_confirmation" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <pictures-upload
                v-model="form.image"
                :preview="images_preview"
                :error="error"
                url="uploads/images"
              />
            </div>
            <div class="col-sm-12">
              <b-form-group label="Observações">
                <b-form-textarea v-model="form.comments" />
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
import vSelect from 'vue-select'
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormAddress from '@/components/FormAddress'
import FormBankAccount from '@/components/FormBankAccount'
import FormSubmit from '@/components/FormSubmit'
import PicturesUpload from '@/components/PicturesUpload'
import FieldError from '@/components/FieldError'
import FormEntitySelect from '@/components/FormEntitySelect'
import tiposDeUsuario from '@/data/tipos-de-usuario.json'

export default {
  name: 'UserForm',
  components: {
    vSelect,
    Breadcrumb,
    Loading,
    FormHeadline,
    FormAddress,
    FormBankAccount,
    FormSubmit,
    FieldError,
    FormEntitySelect,
    PicturesUpload,
  },
  data() {
    return {
      images_preview: [],
      show_password: false,
      tiposDeUsuario,
      groups: [],
      form: {
        username: '',
        email: null,
        password: '',
        password_confirmation: '',
        cpf: '',
        name: '',
        nickname: '',
        contact: '',
        comments: '',
        image: {},
        network: null,
        group: null,
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
        role: null,
      },
    }
  },
  computed: {
    showPasswordFields() {
      return !this.isEditing() || this.show_password
    },
    currentRoleText() {
      if (this.$route.query.role === 'collector') {
        return 'Coletores'
      } else if (this.$route.query.role === 'client') {
        return 'Clientes'
      } else {
        return 'Usuários'
      }
    },
  },
  created() {
    if (this.isEditing()) {
      this.edit(this.$route.params.id)
    } else if (this.$route.query.role) {
      this.form.role = this.$route.query.role
    }
    this.$axios
      .$get('groups')
      .then((response) => {
        if (response) {
          this.groups = response
        }
      })
      .catch(this.showError)
  },
  methods: {
    edit(id) {
      this.isLoading = true
      this.$axios
        .get('users/' + id)
        .then((response) => {
          this.apiDataToForm(this.form, response.data)
          if (response.data.image) {
            this.images_preview = [response.data.image]
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
            url: this.isEditing() ? 'users/' + this.$route.params.id : 'users',
            data: this.form,
          })
            .then((resp) => {
              const user = resp.data
              if (user && user._id) {
                if (user._id === this.currentUser._id) {
                  this.$auth.setUser(user)
                }
                this.$router.replace('/usuarios/' + user._id)
              }
              this.isSending = false
            })
            .catch(this.showError)
        }
      })
    },
    changePassword() {
      this.show_password = !this.show_password
    },
  },
}
</script>
