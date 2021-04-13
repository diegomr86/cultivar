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
              <b-form-group label="Nome de usuário, e-mail ou telefone">
                <b-form-input v-model="form.email" />
              </b-form-group>
              <button
                v-if="form.email"
                type="submit"
                class="btn btn-primary btn-lg btn-block"
              >
                CONTINUAR
              </button>
            </form>
            <div v-if="user">
              <b-media class="pb-4">
                <template #aside>
                  <User :user="user" />
                </template>
                <h5 class="pt-1">
                  {{ user.name || user.email || user.phone || user.username }}
                </h5>
              </b-media>
              <div v-if="$auth.loggedIn">
                <form
                  v-if="user.status === 'pending_password'"
                  @submit.prevent="setPassword"
                >
                  <p>Vamos cadastrar sua senha?</p>
                  <b-form-group label="Digite sua senha">
                    <b-form-input v-model="form.password" type="password" />
                  </b-form-group>
                  <b-form-group label="Confirme sua senha">
                    <b-form-input
                      v-model="form.confirm_password"
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
                  <p>
                    <small
                      >Complete seu cadastro para ter uma experiência mais
                      personalizada</small
                    >
                  </p>
                  <b-form-group label="Nome completo">
                    <b-form-input v-model="form.name" />
                  </b-form-group>
                  <b-form-group label="E-mail">
                    <b-form-input v-model="form.email" />
                  </b-form-group>
                  <b-form-group label="Nome de usuário">
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
                  <b-form-group label="Digite sua senha para continuar">
                    <b-form-input v-model="form.password" type="password" />
                  </b-form-group>
                  <button
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
      form: {
        email: 'diegomr86@gmail.com',
        password: '',
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
  methods: {
    async findUser() {
      if (this.form.email) {
        this.user = await this.$axios
          .$get('/users/' + this.form.email + '/find_or_create')
          .catch(this.showError)
        if (this.user && this.user.status === 'pending_password') {
          this.form.password = 'password'
          await this.login()
        }
        this.populateForm()
      }
    },
    async login() {
      await this.$auth
        .loginWith('local', { data: this.form })
        .catch(this.showError)
      if (this.$auth.loggedIn) {
        if (this.user.status === 'registered') {
          this.$bvModal.hide('login-modal')
        } else {
          this.user = this.$auth.user
        }
      }
    },
    async setPassword() {
      if (
        this.form.password &&
        this.form.password === this.form.confirm_password
      ) {
        const user = await this.$axios
          .$post('/users/set_password', this.form)
          .catch(this.showError)
        if (user) {
          this.$auth.setUser(user)
          this.notify('Sua senha foi salva com sucesso')
        }
      } else {
        this.notify('As duas senhas devem ser iguais', 'error')
      }
    },
    async updateProfile() {
      const user = await this.$axios
        .$put('/users/profile', this.form)
        .catch(this.showError)
      if (user) {
        this.$auth.setUser(user)
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
  },
}
</script>
