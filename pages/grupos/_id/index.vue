<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="group">
    <breadcrumb
      :links="[['Grupos de coletores', '/grupos']]"
      active="Dados do grupo"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="group && !isLoading">
          <div class="row item-title">
            <div class="col-md-10">
              <h1>
                {{ group.name }}
              </h1>
              <p v-if="group.cnpj">
                <span>CNPJ: {{ group.cnpj | cnpj }}</span>
              </p>
            </div>
          </div>
          <hr class="clearfix" />
          <div class="row">
            <div class="col-sm-12">
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Detalhes</strong>
                  <i class="pull-right fa fa-pencil" @click="edit" />
                </div>
                <div class="list-group-item">
                  <div v-if="group.description" class="row">
                    <div class="col-sm-12">
                      <p
                        class="details"
                        colspan="2"
                        v-html="group.description"
                      ></p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6">
                      <dl v-if="group.contact">
                        <dt>Contatos</dt>
                        <dd>{{ group.contact }}</dd>
                      </dl>
                      <dl v-if="group.address">
                        <dt>Endereço</dt>
                        <dd>{{ group.address | address }}</dd>
                      </dl>
                    </div>
                    <div class="col-sm-6">
                      <bank-account v-model="group.bank_account" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div
              v-if="group.collectors && group.collectors.length"
              class="col-sm-6"
            >
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Coletores</strong>
                </div>
                <div
                  v-for="(collector, index) in group.collectors"
                  :key="index"
                  class="list-group-item"
                >
                  <n-link :to="'/usuarios/' + collector._id">
                    <img
                      v-if="collector.image"
                      :src="baseUrl + collector.image.thumb"
                    />
                    <span v-if="collector.name">{{ collector.name }}</span>
                  </n-link>
                </div>
              </div>
            </div>
            <div v-if="group.seeds && group.seeds.length" class="col-sm-6">
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Sementes</strong>
                </div>
                <div
                  v-for="(seed, index) in group.seeds"
                  :key="index"
                  class="list-group-item"
                >
                  <n-link :to="'/sementes/' + seed._id">
                    <img
                      v-if="seed.images && seed.images.length"
                      :src="baseUrl + seed.images[0].thumb"
                    />
                    <span v-if="seed.name">{{ seed.name }}</span>
                  </n-link>
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
  name: 'Group',

  components: {
    Loading,
    Breadcrumb,
    BankAccount,
  },

  data() {
    return {
      group: null,
    }
  },

  created() {
    this.isLoading = true
    this.$axios
      .get('groups/' + this.$route.params.id, {
        params: { populate: 'collectors seeds' },
      })
      .then((group) => {
        this.group = group.data
        this.isLoading = false
      })
      .catch(this.showError)
  },

  methods: {
    edit() {
      this.$router.replace('/grupos/' + this.group._id + '/editar')
    },
  },
}
</script>
