<template>
  <div class="form-viability-rate">
    <div v-for="(item, index) in form" :key="index" class="row">
      <div class="col-md-6">
        <b-form-group label="Natureza da semente">
          <b-form-select
            v-model="item.nature_of_seeds"
            :options="naturezaDasSementes"
            @input="changed"
          />
        </b-form-group>
      </div>
      <div class="col-md-6">
        <b-form-group label="Autor da informação">
          <form-entity-select
            v-model="item.author"
            type="authors"
            @input="changed"
          />
        </b-form-group>
      </div>
    </div>
    <b-button variant="primary" size="sm" class="pull-right" @click="add">
      Adicionar mais
    </b-button>
  </div>
</template>
<script>
import classificacoes from '@/data/classificacoes.json'
import naturezaDasSementes from '@/data/natureza-das-sementes.json'
import FormEntitySelect from '@/components/FormEntitySelect'
export default {
  components: {
    FormEntitySelect,
  },
  props: {
    value: {
      type: Array,
      default: () => null,
    },
  },
  data() {
    return {
      classificacoes,
      naturezaDasSementes,
      form: [],
    }
  },
  created() {
    this.form = [...this.value]
    if (this.form.length === 0) {
      this.add()
    }
  },
  methods: {
    add() {
      this.form.push({
        nature_of_seeds: '',
        author: null,
      })
    },
    changed() {
      this.$emit(
        'input',
        this.form.filter((item) => {
          return item.nature_of_seeds && item.author
        })
      )
    },
  },
}
</script>
