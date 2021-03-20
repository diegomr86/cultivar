<template>
  <div class="login text-center">
    <b-container>
      <b-row v-if="show_login" align-v="center" class="full-height">
        <b-col md="8" offset-md="2" class="pt-3 pb-3">
          <b-card class="bg-blue text-white">
            <b-card-body>
              <img src="~/assets/img/logo.png" class="logo" />
              <h4 class="mb-4 text-white"><strong>Cultivar!</strong> Brasil</h4>
              <p>
                Seja bem vindo!<br /><small>
                  Para melhorar sua experiencia selecione sua região
                  abaixo:</small
                >
              </p>
              <div>
                <b-button
                  variant="primary"
                  block
                  to="/?regiao=Centro-oeste"
                >
                  Centro-oeste
                </b-button>
                <b-button
                  variant="primary"
                  block
                  to="/?regiao=Nordeste"
                >
                  Nordeste
                </b-button>
                <b-button variant="primary" block to="/?regiao=Norte">
                  Norte
                </b-button>
                <b-button
                  variant="primary"
                  block
                  to="/?regiao=Sudeste"
                >
                  Sudeste
                </b-button>
                <b-button variant="primary" block to="/?regiao=Sul">
                  Sul
                </b-button>
                <b-button variant="primary" block to="/?regiao=">
                  Brasil todo
                </b-button>
              </div>
              <!-- <form class="form-auth-small" @submit.prevent="login">
                <div class="form-group">
                  <label for="signin-email" class="control-label sr-only">
                    Nome de usuário ou e-mail
                  </label>
                  <input
                    v-model="form.email"
                    type="text"
                    class="form-control"
                    placeholder="Nome de usuário ou e-mail"
                  />
                </div>
                <div class="form-group">
                  <label for="signin-password" class="control-label sr-only">
                    Senha
                  </label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    placeholder="Senha"
                  />
                </div>
                <b-alert v-if="error" variant="danger" show>{{
                  error
                }}</b-alert>
                <div v-if="isLoading" class="alert alert-info">
                  <i class="fa fa-spinner fa-spin" /> Fazendo login...
                </div>
                <button type="submit" class="btn btn-primary btn-lg btn-block">
                  ENTRAR
                </button>
              </form> -->
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  layout: 'front',
  data() {
    return {
      show_login: false,
      form: {
        email: '',
        password: '',
      },
    }
  },
  created() {
    this.show_login = true
  },
  methods: {
    async login() {
      this.currentError = null
      this.isLoading = true
      const resp = await this.$auth
        .loginWith('local', { data: this.form })
        .catch((error) => {
          this.currentError = error.response.data
        })
      if (resp) {
        this.$router.push(this.$route.query.redirect || '/')
      }
      this.isLoading = false
    },
  },
}
</script>
