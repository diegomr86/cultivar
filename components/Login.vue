<template>
  <div>
    <b-modal id="login-modal" :title="title" hide-footer>
      <div class="login pb-4">
        <b-container>
          <!-- <div class="text-center">
            <img src="~/assets/img/logo.png" class="logo" width="80" />
            <h4 class="mb-4 text-white"><strong>Cultivar</strong> Brasil</h4>
          </div> -->
          <div class="pt-3">
            <!-- Pede o nome de usuário, e-mail ou telefone -->
            <form v-if="!user" @submit.prevent="findUser">
              <b-form-group
                label="Digite seu nome de usuário, e-mail ou telefone"
              >
                <b-form-input v-model="user_login" />
              </b-form-group>
              <button
                v-if="user_login"
                type="submit"
                class="btn btn-primary btn-lg btn-block"
              >
                CONTINUAR
              </button>
            </form>
            <div v-if="user">
              <div v-if="$auth.loggedIn">
                <form
                  v-if="user.status === 'pending_password'"
                  @submit.prevent="setPassword"
                >
                  <b-media class="pb-4">
                    <template #aside>
                      <User :user="user" />
                    </template>
                    <h5 class="mb-0">
                      {{ userLabel(user) }}
                    </h5>
                    <a @click="clearForm">
                      <small> Trocar usuário </small>
                    </a>
                  </b-media>
                  <p>Vamos cadastrar sua senha?</p>
                  <b-form-group label="Digite sua senha">
                    <b-form-input v-model="user_password" type="password" />
                  </b-form-group>
                  <b-form-group label="Confirme sua senha">
                    <b-form-input
                      v-model="user_password_confirmation"
                      type="password"
                    />
                  </b-form-group>
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                  >
                    ENTRAR
                  </button>
                </form>
                <form v-else @submit.prevent="updateProfile">
                  <div class="text-center mb-3">
                    <pictures-upload
                      v-model="form.picture"
                      label="Sua foto"
                      type="avatar"
                    />
                  </div>
                  <b-form-group label="Nome completo">
                    <b-form-input v-model="form.name" />
                  </b-form-group>
                  <b-form-group label="E-mail">
                    <b-form-input v-model="form.email" />
                  </b-form-group>
                  <b-form-group
                    label="Nome de usuário"
                    :description="
                      'Você poderá ser mencionado como: @' + form.username
                    "
                  >
                    <b-form-input v-model="form.username" />
                  </b-form-group>
                  <b-form-group label="Telefone">
                    <b-form-input v-model="form.phone" />
                  </b-form-group>
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                  >
                    SALVAR
                  </button>
                </form>
              </div>
              <div v-else>
                <form @submit.prevent="login">
                  <b-media class="pb-4">
                    <template #aside>
                      <User :user="user" />
                    </template>
                    <h5 class="mb-0">
                      {{ userLabel(user) }}
                    </h5>
                    <a @click="clearForm">
                      <small> Trocar usuário </small>
                    </a>
                  </b-media>
                  <b-form-group
                    v-if="!forgot_password"
                    label="Digite sua senha para continuar"
                    class="mb-0"
                  >
                    <b-form-input v-model="user_password" type="password" />
                  </b-form-group>
                  <ForgotPassword
                    :user="user"
                    @click="forgot_password = true"
                  />
                  <button
                    v-if="user_password"
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                  >
                    ENTRAR
                  </button>
                </form>
              </div>
            </div>
          </div>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: this.$auth.user,
      user_login: 'diegomr86@gmail.com',
      user_password: '',
      user_password_confirmation: '',
      forgot_password: false,
      form: {
        email: '',
        username: '',
        phone: '',
        name: '',
        picture: {},
      },
    }
  },
  computed: {
    title() {
      if (this.user) {
        if (this.$auth.loggedIn) {
          if (this.user.status === 'pending_password') {
            return 'Cadastre sua senha'
          } else {
            return 'Atualize seus dados'
          }
        } else {
          return 'Informe sua senha'
        }
      } else {
        return 'Faça o login para continuar'
      }
    },
  },
  created() {
    this.populateForm()
  },
  mounted() {
    // this.$bvModal.show('login-modal')
  },
  methods: {
    async findUser() {
      if (this.user_login) {
        this.user = await this.$axios
          .$get('/api/users/' + this.user_login + '/find_or_create')
          .catch(this.showError)
        if (this.user && this.user.status === 'pending_password') {
          this.user_password = 'password'
          await this.login()
        }
        this.populateForm()
        this.forgot_password = null
      }
    },
    async login() {
      await this.$auth
        .loginWith('local', {
          data: { email: this.user_login, password: this.user_password },
        })
        .catch(this.showError)
      if (this.$auth.loggedIn) {
        if (this.user.status === 'registered') {
          this.$bvModal.hide('login-modal')
        } else {
          this.user = this.currentUser
        }
      }
    },
    async setPassword() {
      if (
        this.user_password &&
        this.user_password === this.user_password_confirmation
      ) {
        this.user = await this.$axios
          .$post('/api/users/set_password', this.form)
          .catch(this.showError)
        if (this.user) {
          this.$auth.setUser(this.user)
          this.notify('Sua senha foi salva com sucesso')
        }
      } else {
        this.notify('As duas senhas devem ser iguais', 'error')
      }
    },
    async updateProfile() {
      this.user = await this.$axios
        .$put('/api/users/profile', this.form)
        .catch(this.showError)
      if (this.user) {
        this.$auth.setUser(this.user)
        this.notify('Seus dados foram atualizados com sucesso')
        this.$bvModal.hide('login-modal')
      }
    },
    populateForm() {
      if (this.user) {
        Object.keys(this.form).forEach((key) => {
          this.form[key] = this.user[key] || ''
        })
      }
    },
    clearForm() {
      this.user = null
      this.$auth.logout()
      Object.keys(this.form).forEach((key) => {
        this.form[key] = ''
      })
    },
  },
}
</script>
