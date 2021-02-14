<template>
  <div class="potential-item-form">
    <breadcrumb
      :links="[['Potencial de coleta', '/potenciais']]"
      active="Cadastrar"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="potencial de coleta" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <b-form-group label="Selecione a semente">
            <form-entity-select
              v-model="form.seed"
              type="seeds"
              @selected="seedChanged"
            />
          </b-form-group>
          <div v-if="potentials && groups && form.seed" class="row">
            <div class="col-sm-12">
              <table class="table b-table b-table-stacked-md">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Potencial atual</th>
                    <th>Adicionar</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(group, index) in groups">
                    <tr :key="index">
                      <td>
                        {{ group.name }}
                      </td>
                      <td>
                        {{ calcPotential(group) | kg }}
                      </td>
                      <td class="text-right">
                        <b-form-input
                          v-model="form.potential_items[group._id]"
                          class="weight"
                          type="number"
                          step="0.01"
                          lang="nb"
                          min="0"
                          @input="calcTotal"
                        />
                      </td>
                    </tr>
                  </template>
                  <tr>
                    <td><strong> Total</strong></td>
                    <td>
                      <strong>{{
                        potentials.reduce((a, b) => a + b.qtd, 0) | kg
                      }}</strong>
                    </td>
                    <td>
                      <strong>{{ total | kg }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <form-submit
            v-if="form.seed && total > 0"
            :errors="error"
            :sending="isSending"
          />
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'

export default {
  name: 'PotentialForm',
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormSubmit,
  },
  data() {
    return {
      potentials: null,
      groups: null,
      seed: null,
      total: 0,
      form: {
        seed: null,
        createdBy: this.$auth.user._id,
        potential_items: {},
      },
    }
  },
  computed: {},
  async created() {
    this.groups = await this.loadList('groups')
    this.groups.forEach((group) => {
      this.form.potential_items[group._id] = 0
    })
  },
  methods: {
    save() {
      Object.keys(this.form.potential_items).forEach(async (group) => {
        const qtd = this.form.potential_items[group]
        if (qtd > 0) {
          const potential = {
            seed: this.form.seed,
            compensation_collect: this.seed.compensation_collect,
            wholesale_price: this.seed.wholesale_price,
            price: this.seed.price,
            createdBy: this.form.createdBy,
            group,
            qtd,
          }
          await this.$axios.$post('potentials', potential)
        }
      })
      this.notify('Potencial cadastrado com sucesso')
      this.$router.replace('/potenciais')
    },
    calcPotential(group) {
      return this.potentials
        .filter((potential) => potential.group === group._id)
        .reduce((a, b) => a + b.qtd, 0)
    },
    async seedChanged(seed) {
      if (this.form.seed) {
        this.potentials = await this.loadList('potentials', {
          filters: {
            seed: this.form.seed,
            year: new Date().getFullYear().toString(),
          },
        })
      } else {
        this.potentials = null
      }
      this.seed = seed
    },
    calcTotal() {
      this.total = 0
      this.total = Object.values(this.form.potential_items).reduce(
        (a, b) => a + Number(b),
        0
      )
    },
  },
}
</script>
