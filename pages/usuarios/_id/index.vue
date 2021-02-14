<template>
  <div v-if="user" class="user">
    <breadcrumb
      :links="[[currentRoleText, '/usuarios?role=' + (user.role || '')]]"
      :active="'Dados do ' + roleText(user.role).toLowerCase()"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="!isLoading">
          <div class="row item-title">
            <div v-if="user.image && user.image.thumb" class="col-md-2">
              <img
                :src="baseUrl + user.image.thumb"
                class="img-responsive item-img"
              />
            </div>
            <div class="col-md-10">
              <h1>
                {{ user.name }}
              </h1>
              <p>
                <span>{{ user.contact }}</span> &bull;
                <span v-if="user.nickname && user.nickname !== user.name">
                  {{ user.nickname }}
                </span>
              </p>
              <p v-if="user.address">
                <span>
                  {{ user.address | address }}
                </span>
              </p>
              <n-link
                :to="
                  '/usuarios/' + user._id + '/editar?role=' + (user.role || '')
                "
                class="btn btn-default btn-sm"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar {{ roleText(user.role).toLowerCase() }}
              </n-link>
            </div>
          </div>
          <hr class="clearfix" />
          <div class="row">
            <div class="col-sm-6">
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Dados do usuário</strong>
                </div>
                <div class="list-group-item">
                  <dl v-if="user.cpf">
                    <dt>CPF</dt>
                    <dd>{{ user.cpf | cpf }}</dd>
                  </dl>
                  <dl v-if="user.email">
                    <dt>Email</dt>
                    <dd>{{ user.email }}</dd>
                  </dl>
                  <dl v-if="user.name">
                    <dt>Nome de usuário</dt>
                    <dd>{{ user.name }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Dados bancários</strong>
                </div>
                <div class="list-group-item">
                  <bank-account v-model="user.bank_account" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import BankAccount from '@/components/BankAccount'

export default {
  name: 'User',

  components: {
    Loading,
    Breadcrumb,
    BankAccount,
  },

  data() {
    return {
      user: null,
    }
  },
  computed: {
    currentRoleText() {
      if (this.user.role === 'collector') {
        return 'Coletores'
      } else if (this.user.role === 'client') {
        return 'Clientes'
      } else {
        return 'Usuários'
      }
    },
  },
  created() {
    this.isLoading = true

    this.$axios
      .get('users/' + this.$route.params.id)
      .then((user) => {
        this.user = user.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
}
</script>
