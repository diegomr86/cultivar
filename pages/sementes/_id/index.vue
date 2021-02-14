<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="seed">
    <breadcrumb
      :links="[['Sementes', '/sementes']]"
      active="Dados da semente"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="seed && !isLoading">
          <div class="row item-title">
            <div v-if="seed.images && seed.images.length" class="col-md-2">
              <img
                :src="baseUrl + seed.images[0].url"
                class="img-responsive item-img"
              />
            </div>
            <div class="col-md-10">
              <h1>
                {{ seed.name }}
              </h1>
              <p v-if="seed.specie">
                <n-link :to="'/especies/' + seed.specie.slug">{{
                  seed.specie.scientific_name
                }}</n-link>
              </p>
              <p v-else>
                <span>{{ seed.scientific_name }}</span>
              </p>
              <n-link
                v-if="!isSuper && isManagerOrAbove"
                :to="'/sementes/' + seed._id + '/editar'"
                class="btn btn-default btn-sm"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar semente
              </n-link>
            </div>
          </div>
          <hr class="clearfix" />
          <b-card-group deck>
            <b-card
              v-if="isManagerOrAbove && seed.price"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Preço"
            >
              <b-card-title>{{ seed.price | moeda }}</b-card-title>
            </b-card>
            <b-card
              v-if="isManagerOrAbove && seed.wholesale_price"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Preço no atacado"
            >
              <b-card-title>{{ seed.wholesale_price | moeda }}</b-card-title>
            </b-card>
            <b-card
              v-if="seed.compensation_collect"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Remuneração do coletor"
            >
              <b-card-title>{{
                seed.compensation_collect | moeda
              }}</b-card-title>
            </b-card>
            <b-card
              v-if="isManagerOrAbove && seed.stock"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Quantidade em estoque"
            >
              <span class="number" :class="{ red: seed.stock <= 0 }">{{
                seed.stock | kg
              }}</span>
            </b-card>
          </b-card-group>
          <br />
          <div class="row">
            <div class="col-sm-12">
              <div class="list-group entity-select-preview">
                <div class="list-group-item active">
                  <strong>Detalhes</strong>
                </div>
                <div class="list-group-item">
                  <div v-if="seed.description" class="row">
                    <div class="col-sm-12">
                      <p
                        class="details"
                        colspan="2"
                        v-html="seed.description"
                      ></p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6">
                      <dl>
                        <dt>Qtd. de sementes / Kg</dt>
                        <dd>{{ seed.seeds_kg }} sementes / Kg</dd>
                      </dl>
                      <dl>
                        <dt>Taxa de viabilidade</dt>
                        <dd>{{ seed.viability_rate }} % de viabilidade</dd>
                      </dl>
                      <dl>
                        <dt>Limite de peso por lote</dt>
                        <dd>{{ seed.lot_limit | kg }} por lote</dd>
                      </dl>
                    </div>
                    <div class="col-sm-6">
                      <dl
                        v-if="seed.ecosystem && seed.ecosystem.length"
                        class="ecosystem"
                      >
                        <dt>Ecossistemas</dt>
                        <dd>
                          <b-badge
                            v-for="(ecosystem, index) in seed.ecosystem"
                            :key="index"
                            >{{ ecosystem }}</b-badge
                          >
                        </dd>
                      </dl>
                      <dl
                        v-if="
                          seed.fruiting_season && seed.fruiting_season.length
                        "
                        class="fruiting_season"
                      >
                        <dt>Época da frutificação</dt>
                        <dd>
                          <b-badge
                            v-for="(fruiting_season_option, index) in meses"
                            :key="index"
                            :class="{
                              'badge-success': !!seed.fruiting_season.find(
                                (fs) => fs === fruiting_season_option.value
                              ),
                            }"
                            >{{ fruiting_season_option.text }}</b-badge
                          >
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="seed.specie">
            <h4 class="text-center">INFORMAÇÕES DA ESPÉCIE</h4>
            <br />
            <specie-info :specie="seed.specie" />
          </div>
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
  name: 'Seed',
  components: {
    Loading,
    Breadcrumb,
    SpecieInfo,
  },
  data() {
    return {
      meses,
      seed: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('seeds/' + this.$route.params.id, { params: { populate: 'specie' } })
      .then((resp) => {
        this.seed = resp.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
}
</script>
