import Vue from 'vue'
import * as cpf from '@fnando/cpf'
import * as cnpj from '@fnando/cnpj'
import api from '@/api/api'
import tiposDeUsuario from '@/data/tipos-de-usuario.json'

if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true

  const globalMixin = {
    data() {
      return {
        error: null,
        isLoading: false,
        isSending: false,
        tiposDeUsuario,
      }
    },
    computed: {
      currentUser() {
        return this.$auth.user
      },
      currentRegion() {
        return this.$store.state.region
      },
      currentRole() {
        if (this.currentUser.role === 'super') {
          return { value: 'super', text: 'Super usuário' }
        } else {
          return tiposDeUsuario.find((e) => e.value === this.currentUser.role)
        }
      },
      isSuper() {
        return this.hasRole('super')
      },
      isAdminOrAbove() {
        return this.hasRole('admin') || this.hasRole('super')
      },
      isManagerOrAbove() {
        return (
          this.hasRole('manager') ||
          this.hasRole('admin') ||
          this.hasRole('super')
        )
      },
      isCollectorOrAbove() {
        return (
          this.hasRole('collector') ||
          this.hasRole('manager') ||
          this.hasRole('admin') ||
          this.hasRole('super')
        )
      },
      isClientOrAbove() {
        return (
          this.hasRole('client') ||
          this.hasRole('manager') ||
          this.hasRole('admin') ||
          this.hasRole('super')
        )
      },
      baseUrl() {
        return this.$axios.defaults.baseURL.replace('/api', '')
      },
      years() {
        const year = 2019
        const years = [{ value: null, text: 'Todos os anos' }]
        for (let i = year; i <= new Date().getFullYear(); i++) {
          years.push(i.toString())
        }
        return years
      },
    },
    methods: {
      hasRole(role) {
        const currentUser = this.currentUser
        if (currentUser && currentUser.role) {
          return currentUser.role === role
        }
        return false
      },
      isEditing() {
        return !!this.$route.params.id
      },
      setRegion(region) {
        this.$store.commit('setRegion', region)
      },
      apiDataToForm(form, data) {
        Object.keys(form).forEach((key) => {
          if (data && data[key]) {
            if (
              typeof data[key] === 'string' &&
              data[key].includes('T00:00:00.000Z') &&
              key !== 'date_time'
            ) {
              form[key] = data[key].replace(/T00:00:00.000Z/g, '')
            } else {
              form[key] = data[key]
            }
          }
        })
      },
      async loadList(type, filters) {
        return await api.loadList(type, filters).catch(this.showError)
      },
      showError(error) {
        if (error.response) {
          if (error.response.data) {
            if (
              error.response.status === 401 &&
              error.response.data.includes('invalid signature')
            ) {
              this.error = 'Sessão expirada!'
              this.$auth.logout()
              this.$router.replace('/')
            } else if (error.response.data.message) {
              this.error = error.response.data.message
            } else {
              this.error = error.response.data
            }
          } else {
            this.error = error.response
          }
        }
        this.isLoading = false
        this.isSending = false
      },
      formatCity(address) {
        return address
          ? [address.city, address.uf].filter(Boolean).join(' - ')
          : ''
      },
      sumQtd(qtd) {
        if (typeof qtd === 'object') {
          return qtd
            .map((q) => parseFloat(q.qtd || 0))
            .reduce((a, b) => a + b, 0)
        }
        return qtd || 0
      },
      notify(msg, type) {
        this.$notify({
          type: type || 'success',
          text: msg,
        })
      },
      roleText(role) {
        const roleObject = tiposDeUsuario.find(
          (tipoDeUsuario) => tipoDeUsuario.value === role
        )
        if (roleObject) {
          return roleObject.text
        }
        if (role === 'super') {
          return 'Super usuário'
        }
        return 'Usuário'
      },
    },
    filters: {
      cpf(value) {
        return cpf.format(value)
      },
      cnpj(value) {
        return cnpj.format(value)
      },
      data(value) {
        return value.toLocaleDateString('pt-BR')
      },
      address(address) {
        return address
          ? [address.address, address.city, address.uf, address.postal_code]
              .filter(Boolean)
              .join(' - ')
          : ''
      },
      city(address) {
        return address
          ? [address.city, address.uf].filter(Boolean).join(' - ')
          : ''
      },
      filename(fileUrl) {
        if (fileUrl) {
          const urlArr = fileUrl.split('/')
          return urlArr[urlArr.length - 1]
        }
        return ''
      },
    },
  }

  Vue.mixin(globalMixin)
}
