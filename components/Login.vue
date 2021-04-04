<template>
  <div>
    <b-modal v-model="showLogin" :title="title" hide-footer>
      <div class="login text-center pb-4">
        <b-container>
          <img src="~/assets/img/logo.png" class="logo" width="80" />
          <h4 class="mb-4 text-white"><strong>Cultivar</strong> Brasil</h4>
          <div v-if="!show_register">
            <form v-if="!user" @submit.prevent="check">
              <!-- <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert> -->
              <b-form-group label="Nome de usuário ou e-mail">
                <b-form-input
                  v-model="form.email"
                  placeholder="Digite seu e-mail ou telefone"
                />
              </b-form-group>
              <button
                v-if="form.email"
                type="submit"
                class="btn btn-primary btn-lg btn-block"
              >
                CONTINUAR
              </button>
            </form>
            <form v-if="user" class="form-auth-small" @submit.prevent="login">
              <b-form-group label="Nome de usuário ou e-mail">
                <b-form-input
                  v-model="form.email"
                  placeholder="Digite seu e-mail ou telefone"
                />
              </b-form-group>
              <b-form-group label="Senha">
                <b-form-input
                  v-model="form.password"
                  type="password"
                  placeholder="Senha"
                />
              </b-form-group>
              <button type="submit" class="btn btn-primary btn-lg btn-block">
                ENTRAR
              </button>
            </form>
          </div>
          <div v-else>
            <form class="form-auth-small" @submit.prevent="register">
              <b-form-group label="E-mail">
                <b-form-input
                  v-model="form.email"
                  placeholder="Digite seu e-mail ou telefone"
                />
              </b-form-group>
              <b-form-group label="Nome de usuário">
                <b-form-input
                  v-model="form.email"
                  placeholder="Digite seu e-mail ou telefone"
                />
              </b-form-group>
              <b-form-group label="Senha">
                <b-form-input
                  v-model="form.password"
                  type="password"
                  placeholder="Senha"
                />
              </b-form-group>
              <button type="submit" class="btn btn-primary btn-lg btn-block">
                CONTINUAR
              </button>
            </form>
          </div>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Faça o login para continuar',
    },
  },
  data() {
    return {
      user: null,
      show_register: false,
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
    showLogin() {
      return this.$store.state.show_login
    },
  },
  methods: {
    async check() {
      if (this.form.email) {
        this.user = await this.$axios
          .$get('/api/users/' + this.form.email + '/check')
          .catch(() => {
            this.register = true
            const userName = this.form.email
              .replace('(', '')
              .replace(')', '')
              .replace('-', '')
              .replace('.', '')
              .replace(' ', '')
            if (!userName.includes('@')) {
              this.form.email = null
              if (!isNaN(userName)) {
                this.form.phone = userName
              } else {
                this.form.username = userName
              }
            }
          })
      }
    },
    async login() {
      await this.$auth
        .loginWith('local', { data: this.form })
        .catch(this.showError)
    },
    async register() {
      const user = await this.$axios
        .$post('/api/users/register', this.register_form)
        .catch(this.showError)
      if (user && user._id) {
        await this.$auth
          .loginWith('local', { data: this.register_form })
          .catch(this.showError)
      }
    },
  },
}
</script>
