<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-if="specie && specie.scientific_name" class="specie-info">
    <div class="row">
      <div class="col-sm-12">
        <div class="list-group entity-select-preview">
          <div class="list-group-item active">
            <strong>Identificação</strong>
          </div>
          <div class="list-group-item">
            <div v-if="specie.description" class="row">
              <div class="col-sm-12">
                <p class="details" colspan="2" v-html="specie.description"></p>
              </div>
            </div>
            <dl v-if="specie.code">
              <dt>Código</dt>
              <dd>
                <n-link :to="'/especies/' + specie.slug">{{
                  specie.code
                }}</n-link>
              </dd>
            </dl>
            <dl v-if="specie.scientific_name">
              <dt>Nome científico</dt>
              <dd>
                {{ specie.scientific_name }}
              </dd>
            </dl>
            <dl v-if="specie.local_name">
              <dt>Nomes populares</dt>
              <dd>
                {{ specie.local_name.join(', ') }}
              </dd>
            </dl>
            <dl v-if="specie.family">
              <dt>Família</dt>
              <dd>
                {{ specie.family }}
              </dd>
            </dl>
            <div v-if="specie.images && specie.images.length > 1" class="row">
              <div
                v-for="(image, index) in specie.images"
                :key="index"
                class="col-sm-3"
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
      <div class="col-sm-12">
        <div class="list-group entity-select-preview">
          <div class="list-group-item active">
            <strong>Ocorrência / Indicação para plantio</strong>
          </div>
          <div class="list-group-item">
            <dl v-if="specie.biomes">
              <dt>Bioma</dt>
              <dd>
                {{ specie.biomes.join(', ') }}
              </dd>
            </dl>
            <dl
              v-if="specie.vegetation_types && specie.vegetation_types.length"
              class="ecosystem"
            >
              <dt>Tipos de Vegetação</dt>
              <dd>
                <b-badge
                  v-for="(vegetation_type, index) in specie.vegetation_types"
                  :key="index"
                  >{{ vegetation_type }}</b-badge
                >
              </dd>
            </dl>
            <dl
              v-if="specie.presence && specie.presence.length"
              class="ecosystem"
            >
              <dt>Presença nos estados</dt>
              <dd>
                <b-badge v-for="(uf, index) in specie.presence" :key="index">{{
                  uf
                }}</b-badge>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="col-sm-12">
        <div class="list-group entity-select-preview">
          <div class="list-group-item active">
            <strong>Classe de Sucessão</strong>
          </div>
          <div class="list-group-item">
            <dl v-if="specie.habit">
              <dt>Hábito</dt>
              <dd>
                {{ specie.habit }}
              </dd>
            </dl>
            <dl v-if="specie.origin">
              <dt>Origem</dt>
              <dd>
                {{ specie.origin }}
              </dd>
            </dl>
            <dl v-if="specie.cycle">
              <dt>Longevidade</dt>
              <dd>
                {{ specie.cycle }}
              </dd>
            </dl>
            <dl v-if="specie.occupation_strategy">
              <dt>Estratégia de ocupação</dt>
              <dd>
                {{ specie.occupation_strategy }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="col-sm-12">
        <div class="list-group entity-select-preview">
          <div class="list-group-item active">
            <strong>Plantio das sementes</strong>
          </div>
          <div class="list-group-item">
            <dl v-if="specie.viability_rate">
              <dt>Classe de % de estabelecimento em campo</dt>
              <dd>
                <span v-if="specie.viability_rate.from === 0">
                  {{ '&lt; ' + specie.viability_rate.to + '%' }}</span
                >
                <span v-else-if="specie.viability_rate.to === 100">
                  {{ '&gt; ' + specie.viability_rate.from + '%' }}</span
                >
                <span v-else>
                  {{
                    specie.viability_rate.from +
                    ' a ' +
                    specie.viability_rate.to +
                    '%'
                  }}</span
                >
                <span v-if="specie.viability_rate.description">
                  ({{ specie.viability_rate.description }})</span
                >
              </dd>
            </dl>
            <dl v-if="specie.seeds_per_kg">
              <dt>Número de sementes / Kg</dt>
              <dd>{{ specie.seeds_per_kg }} sementes</dd>
            </dl>
            <dl
              v-if="
                specie.seed_conservations && specie.seed_conservations.length
              "
            >
              <dt>Conservação de Sementes - (Natureza das Sementes)</dt>
              <dd
                v-for="seed_conservation in specie.seed_conservations"
                :key="seed_conservation._id"
              >
                {{ seed_conservation.nature_of_seeds }}
                <small v-if="seed_conservation.author"
                  >({{ seed_conservation.author.name }})</small
                >
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="col-sm-12">
        <div class="list-group entity-select-preview">
          <div class="list-group-item active">
            <strong>Produção das Sementes</strong>
          </div>
          <div class="list-group-item">
            <dl
              v-if="specie.seed_processings && specie.seed_processings.length"
            >
              <dt>Beneficiamento de sementes</dt>
              <dd
                v-for="seed_processing in specie.seed_processings"
                :key="seed_processing._id"
              >
                {{ seed_processing.tip }}
                <small v-if="seed_processing.author"
                  >({{ seed_processing.author.name }})</small
                >
              </dd>
            </dl>
            <dl v-if="specie.seed_storages && specie.seed_storages.length">
              <dt>Armazenamento</dt>
              <dd
                v-for="seed_storage in specie.seed_storages"
                :key="seed_storage._id"
              >
                {{ seed_storage.tip }}
                <small v-if="seed_storage.author"
                  >({{ seed_storage.author.name }})</small
                >
              </dd>
            </dl>
            <dl
              v-if="specie.seed_collectings && specie.seed_collectings.length"
            >
              <dt>Coleta</dt>
              <dd
                v-for="seed_collecting in specie.seed_collectings"
                :key="seed_collecting._id"
              >
                {{ seed_collecting.tip }}
                <small v-if="seed_collecting.author"
                  >({{ seed_collecting.author.name }})</small
                >
              </dd>
            </dl>
            <dl v-if="specie.planting_tips">
              <dt>Dicas de plantio</dt>
              <dd>
                {{ specie.planting_tips }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="col-sm-12">
        <div class="list-group entity-select-preview">
          <div class="list-group-item active">
            <strong>Informações gerais</strong>
          </div>
          <div class="list-group-item">
            <dl>
              <dt>Espécie com dados quantificados sistematicamente?</dt>
              <dd>
                {{ specie.systematically_quantified_data ? 'SIM' : 'NÃO' }}
              </dd>
            </dl>
            <dl>
              <dt>Ja testadas na Semeadura direta?</dt>
              <dd>
                {{ specie.already_tested_in_direct_seedin ? 'SIM' : 'NÃO' }}
              </dd>
            </dl>
            <dl>
              <dt>Possui padrão de qualidade de análise (MAPA)?</dt>
              <dd>{{ specie.mapa_standard_established ? 'SIM' : 'NÃO' }}</dd>
            </dl>
            <dl v-if="specie.lot_limit">
              <dt>Limite de peso por lote</dt>
              <dd>{{ specie.lot_limit | kg }} por lote</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div v-if="specie.images && specie.images.length > 1" class="row">
      <div
        v-for="(image, index) in specie.images"
        :key="index"
        class="col-sm-3"
      >
        <b-img :key="index" :src="baseUrl + image.thumb" fluid thumbnail />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    specie: {
      type: Object,
      default: null,
    },
  },
}
</script>
