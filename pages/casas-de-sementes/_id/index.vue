<template>
  <div class="seeds-house">
    <breadcrumb
      :links="[['Casas de sementes', '/casas-de-sementes']]"
      active="Dados da casa"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="seeds_house && !isLoading">
          <div class="row item-title">
            <div class="col-md-10">
              <h1>{{ seeds_house.code }} - {{ seeds_house.name }}</h1>
              <p>
                <span v-if="seeds_house.phone">{{ seeds_house.phone }}</span>
                &bull;
                <span v-if="seeds_house.owner">
                  Proprietário: {{ seeds_house.owner.name }}
                </span>
              </p>
              <n-link
                v-if="!isSuper"
                :to="'/casas-de-sementes/' + seeds_house._id + '/editar'"
                class="btn btn-default btn-sm"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar casa
              </n-link>
            </div>
          </div>
          <hr class="clearfix" />
          <div class="row">
            <div
              v-if="seeds_house.collectors && seeds_house.collectors.length"
              class="col-sm-6"
            >
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Coletores</strong>
                </div>
                <div
                  v-for="(collector, index) in seeds_house.collectors"
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
            <div
              v-if="seeds_house.groups && seeds_house.groups.length"
              class="col-sm-6"
            >
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Grupos de coletores</strong>
                </div>
                <div
                  v-for="(group, index) in seeds_house.groups"
                  :key="index"
                  class="list-group-item"
                >
                  <n-link :to="'/grupos/' + group._id">
                    <span v-if="group.name">{{ group.name }}</span>
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

export default {
  name: 'SeedsHouse',
  components: {
    loading: Loading,
    breadcrumb: Breadcrumb,
  },

  data() {
    return {
      seeds_house: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('seeds_houses/' + this.$route.params.id, {
        params: {
          populate: 'collectors groups owner',
        },
      })
      .then((response) => {
        this.seeds_house = response.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
}
</script>
