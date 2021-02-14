<template>
  <div class="specie">
    <breadcrumb
      :links="[['Espécies', '/especies']]"
      active="Dados da espécie"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="specie && !isLoading">
          <div class="row item-title">
            <div v-if="specie.images && specie.images.length" class="col-md-2">
              <img
                :src="baseUrl + specie.images[0].url"
                class="img-responsive item-img"
              />
            </div>
            <div class="col-md-10">
              <h1>
                {{ specie.scientific_name }}
              </h1>
              <p>
                <span>{{ specie.local_name.join(', ') }}</span>
              </p>
              <n-link
                v-if="isSuper"
                :to="'/editar-especie/' + specie.slug"
                class="btn btn-default btn-sm"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar espécie
              </n-link>
            </div>
          </div>
          <hr class="clearfix" />
          <specie-info :specie="specie" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import SpecieInfo from '@/components/SpecieInfo'
import meses from '@/data/meses.json'

export default {
  name: 'Specie',
  components: {
    Loading,
    Breadcrumb,
    SpecieInfo,
  },
  data() {
    return {
      meses,
      specie: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('species/' + this.$route.params.id)
      .then((resp) => {
        this.specie = resp.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
}
</script>
