<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="collection-area">
    <breadcrumb
      :links="[['Coletas de sementes', '/coletas']]"
      active="Dados da coleta"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="collection && !isLoading">
          <div class="row item-title">
            <div
              v-if="collection.images && collection.images.length"
              class="col-md-2"
            >
              <img
                :src="baseUrl + collection.images[0].thumb"
                class="img-responsive item-img"
              />
            </div>
            <div class="col-md-10">
              <h1>
                <span v-if="collection.seed"
                  >Coleta de {{ collection.seed.name }}</span
                >
                <small v-if="collection.date_time"
                  ><br />{{
                    collection.date_time | moment('DD/MM/YYYY HH:mm')
                  }}</small
                >
              </h1>
              <p v-if="isManagerOrAbove">
                <n-link
                  v-if="collection.group"
                  :to="'/grupos/' + collection.group._id"
                >
                  &bull; {{ collection.group.name }}
                </n-link>
                <n-link
                  v-if="collection.collector"
                  :to="'/usuarios/' + collection.collector._id"
                >
                  &bull; {{ collection.collector.name }}
                </n-link>
              </p>
              <n-link
                v-if="!isSuper"
                :to="'/coletas/' + collection._id + '/editar'"
                class="btn btn-default btn-sm"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar coleta
              </n-link>
            </div>
          </div>
          <hr class="clearfix" />
          <b-card-group deck>
            <b-card
              v-if="collection.weight_gross"
              bg-variant="dark"
              text-variant="white"
              header="Peso bruto"
              class="text-center"
            >
              <b-card-title>
                {{ collection.weight_gross | kg }}
              </b-card-title>
            </b-card>
            <b-card
              v-if="collection.weight_benef"
              bg-variant="dark"
              text-variant="white"
              header="Peso beneficiado"
              class="text-center"
            >
              <b-card-title>
                {{ collection.weight_benef | kg }}
              </b-card-title>
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
                  <div v-if="collection.commentary" class="row">
                    <div class="col-sm-12">
                      <p
                        class="details"
                        colspan="2"
                        v-html="collection.commentary"
                      ></p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6">
                      <dl v-if="collection.flowering">
                        <dt>Período de florescimento</dt>
                        <dd>
                          {{ collection.flowering | moment('DD/MM/YYYY') }}
                        </dd>
                      </dl>
                      <dl v-if="collection.audio">
                        <dt>Áudio</dt>
                        <dd>
                          <a :href="baseUrl + collection.audio" target="_blank"
                            ><i class="fa fa-music" />
                            {{ fileName(collection.audio) }}</a
                          >
                        </dd>
                        <dd>
                          <br />
                          <audio
                            :src="baseUrl + collection.audio"
                            controls
                          ></audio>
                        </dd>
                      </dl>
                    </div>
                    <div class="col-sm-6">
                      <dl v-if="collection.geolocation">
                        <dt>Latitude</dt>
                        <dd>{{ collection.geolocation.lat }}</dd>
                      </dl>
                      <dl v-if="collection.geolocation">
                        <dt>Longitude</dt>
                        <dd>{{ collection.geolocation.lng }}</dd>
                      </dl>
                    </div>
                  </div>
                  <div
                    v-if="collection.images && collection.images.length > 1"
                    class="row"
                  >
                    <div
                      v-for="(image, index) in collection.images"
                      :key="index"
                      class="col-sm-4"
                    >
                      <b-img
                        :key="index"
                        :src="baseUrl + image.thumb"
                        fluid
                        thumbnail
                      />
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
  name: 'Collection',
  components: {
    loading: Loading,
    breadcrumb: Breadcrumb,
  },

  data() {
    return {
      collection: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('collections/' + this.$route.params.id, {
        params: {
          populate: 'group collector seed',
        },
      })
      .then((response) => {
        this.collection = response.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
  methods: {
    edit() {
      this.$router.replace('/coletas/' + this.collection._id + '/editar')
    },
    fileName(fileUrl) {
      if (fileUrl) {
        const url = fileUrl.split('/')
        return decodeURIComponent(url[url.length - 1])
      }
    },
  },
}
</script>
