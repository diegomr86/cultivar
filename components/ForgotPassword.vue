<template>
  <div>
    <a v-if="!recovery_response" @click="recovery"
      ><small>Esqueci minha senha</small></a
    >
    <div v-else>
      <div v-if="recovery_response.email">
        <p>
          Enviamos um código de recuperação para o email:
          <strong>{{ recovery_response.email }}</strong>
        </p>
        <div v-if="validate_recovery_response === null">
          <p>Insira esse código abaixo para continar</p>
          <b-form-input
            v-model="recovery_code"
            @keyup.prevent.enter="validateRecoveryCode"
          />
          <b-btn
            v-if="recovery_code"
            class="mt-2"
            variant="primary"
            @click="validateRecoveryCode"
            >Validar código</b-btn
          >
        </div>
        <div v-if="validate_recovery_response">
          <div>
            Validamos seu código de recuperação com sucesso! Agora é hora de
            criar sua nova senha:
          </div>
          <b-form-group label="Digite sua nova senha">
            <b-form-input v-model="password" type="password" />
          </b-form-group>
          <b-form-group label="Confirme sua nova senha">
            <b-form-input v-model="password_confirmation" type="password" />
          </b-form-group>
          <button type="submit" class="btn btn-primary btn-lg btn-block">
            ENTRAR
          </button>
        </div>
        <div v-if="validate_recovery_response === false">
          <div class="alert alert-danger">Código inválido</div>
        </div>
      </div>
      <div v-else-if="user.has_phone"></div>
      <div v-else>
        Enviamos um código de 4 digitos para o email:
        <strong>{{ user.email }}</strong>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      recovery_response: null,
      validate_recovery_response: null,
      recovery_code: null,
      password: null,
      password_confirmation: null,
    }
  },
  methods: {
    async recovery() {
      this.recovery_code = null
      this.recovery_response = await this.$axios.$get(
        '/api/users/password_recovery/' + this.user.id
      )
      this.$emit('click')
    },
    async validateRecoveryCode() {
      this.validate_recovery_response = null
      this.validate_recovery_response = await this.$axios.$post(
        '/api/users/validate_recovery/' + this.user.id,
        { code: this.recovery_code }
      )
    },
    async setPassword() {
      if (this.password && this.password === this.password_confirmation) {
        await this.$axios
          .$post('/api/users/set_password', {
            password: this.password,
            password_confirmation: this.password_confirmation,
            recovery_code: this.recovery_code,
          })
          .catch(this.showError)
        if (this.user) {
          this.$auth.setUser(this.user)
          this.notify('Sua senha foi salva com sucesso')
        }
      } else {
        this.notify('As duas senhas devem ser iguais', 'error')
      }
    },
  },
}
</script>
