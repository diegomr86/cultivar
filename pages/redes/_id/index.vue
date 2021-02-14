<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="network">
    <breadcrumb :links="[['Redes', '/redes']]" active="Dados da rede" />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="network && !isLoading">
          <div class="row item-title">
            <div v-if="network.image && network.image.thumb" class="col-md-2">
              <img
                :src="baseUrl + network.image.thumb"
                class="img-responsive item-img"
              />
            </div>
            <div class="col-md-10">
              <h1>
                {{ network.name }}
              </h1>
              <p v-if="network.domain_name">
                <span>{{ network.domain_name }}</span>
              </p>
              <p v-else>
                <span>{{ network.slug }}</span>
              </p>
              <p v-if="network.address">
                <span>
                  {{ network.address | address }}
                </span>
              </p>
              <n-link
                :to="'/redes/' + network._id + '/editar'"
                class="btn btn-default btn-sm"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar rede
              </n-link>
            </div>
          </div>
          <hr class="clearfix" />
          <div class="row">
            <div class="col-sm-12">
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Detalhes</strong>
                </div>
                <div class="list-group-item">
                  <div v-if="network.description" class="row">
                    <div class="col-sm-12">
                      <p
                        class="details"
                        colspan="2"
                        v-html="network.description"
                      ></p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6">
                      <dl v-if="network.cnpj">
                        <dt>CNPJ</dt>
                        <dd>{{ network.cnpj }}</dd>
                      </dl>
                      <dl v-if="network.contact">
                        <dt>Contatos</dt>
                        <dd>{{ network.contact }}</dd>
                      </dl>
                    </div>
                  </div>
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

export default {
  name: 'Network',
  components: {
    Loading,
    Breadcrumb,
  },
  data() {
    return {
      network: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('networks/' + this.$route.params.id)
      .then((network) => {
        this.network = network.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
}
</script>
